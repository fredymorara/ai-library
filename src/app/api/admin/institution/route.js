import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";

export async function GET(request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceSupabase = createServiceRoleClient();

    let { data: institution, error: institutionError } = await serviceSupabase
      .from('institutions')
      .select('id, name')
      .eq('clerk_org_id', orgId)
      .single();

    if (institutionError && institutionError.code !== 'PGRST116') { // PGRST116 = not found
      console.error("Institution lookup error:", institutionError);
      return NextResponse.json({ error: 'Failed to verify institution.' }, { status: 500 });
    }

    if (!institution) {
      const { data: newInstitution, error: createError } = await serviceSupabase
        .from('institutions')
        .insert({
          clerk_org_id: orgId,
          name: orgId, // You can get actual org name from Clerk if needed
        })
        .select('id, name')
        .single();

      if (createError) {
        console.error("Institution creation error:", createError);
        return NextResponse.json({ error: 'Failed to create institution record.', details: createError.message }, { status: 500 });
      }

      institution = newInstitution;
    }

    return NextResponse.json({ institution });

  } catch (e) {
    console.error('Error in institution route:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
