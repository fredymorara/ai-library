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

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    const { count, error } = await supabase
      .from('chat_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('institution_id', institution.id)
      .gte('started_at', firstDayOfMonth);

    if (error) {
      throw error;
    }

    // In a real app, you would also calculate previous month's count for percentage change
    // For now, we'll just return the current month's count.

    return NextResponse.json({ chatsThisMonth: count || 0, change: 0 });

  } catch (e) {
    console.error('Analytics API error:', e);
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}
