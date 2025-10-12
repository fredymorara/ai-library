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

    const supabase = createServiceRoleClient();

    const { data: institution } = await supabase.from('institutions').select('id').eq('clerk_org_id', orgId).single();
    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }
    const institutionId = institution.id;

    // Get all book counts in one go
    const { count: totalBooks, error: totalBooksError } = await supabase.from('books').select('id', { count: 'exact', head: true }).eq('institution_id', institutionId);
    if (totalBooksError) throw totalBooksError;

    const { count: ingestedBooks, error: ingestedBooksError } = await supabase.from('books').select('id', { count: 'exact', head: true }).eq('institution_id', institutionId).eq('is_ingested', true);
    if (ingestedBooksError) throw ingestedBooksError;

    // Get chat analytics
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30)).toISOString();

    const { count: chatsThisMonth, error: monthError } = await supabase.from('chat_sessions').select('id', { count: 'exact', head: true }).eq('institution_id', institutionId).gte('started_at', firstDayOfMonth);
    if (monthError) throw monthError;

    const { data: dailyData, error: dailyError } = await supabase.rpc('get_daily_chat_counts', { p_institution_id: institutionId, start_date: thirtyDaysAgo });
    if (dailyError) throw dailyError;

    return NextResponse.json({ 
      totalBooks: totalBooks || 0,
      ingestedBooks: ingestedBooks || 0,
      chatsThisMonth: chatsThisMonth || 0, 
      dailyChats: dailyData || [],
      change: 0 // Placeholder
    });

  } catch (e) {
    console.error('Analytics API error:', e);
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}
