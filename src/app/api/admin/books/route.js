import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const searchTerm = searchParams.get('search') || '';
    const isIngested = searchParams.get('is_ingested') === 'true';

    const offset = (page - 1) * limit;

    const supabase = createServiceRoleClient();

    // First, get the institution ID
    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }
    const institutionId = institution.id;

    // Build the query
    let query = supabase
      .from('books')
      .select('id, title, author, is_ingested, file_name, created_at', { count: 'exact' })
      .eq('institution_id', institutionId);

    // Add ingested filter if requested
    if (isIngested) {
      query = query.eq('is_ingested', true);
    }

    // Add search filter if a search term is provided
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
    }

    // Add pagination and ordering
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: books, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch books', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      books: books || [], 
      totalCount: count 
    });

  } catch (e) {
    console.error('Error fetching books:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.message }, { status: 500 });
  }
}
