import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";

export const runtime = 'nodejs';

// POST /api/admin/api-keys/[key_id] (to toggle status)
export async function POST(request, { params }) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key_id } = params;
    const { is_active } = await request.json();

    const supabase = createServiceRoleClient();

    // Verify ownership
    const { data: apiKey } = await supabase.from('api_keys').select('id, institution_id').eq('id', key_id).single();
    const { data: institution } = await supabase.from('institutions').select('id').eq('clerk_org_id', orgId).single();

    if (!apiKey || !institution || apiKey.institution_id !== institution.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the key status
    const { data: updatedKey, error } = await supabase
      .from('api_keys')
      .update({ is_active })
      .eq('id', key_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update key status.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ updatedKey });

  } catch (e) {
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/api-keys/[key_id] (to permanently delete)
export async function DELETE(request, { params }) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key_id } = params;
    const supabase = createServiceRoleClient();

    // Verify ownership
    const { data: apiKey } = await supabase.from('api_keys').select('id, institution_id').eq('id', key_id).single();
    const { data: institution } = await supabase.from('institutions').select('id').eq('clerk_org_id', orgId).single();

    if (!apiKey || !institution || apiKey.institution_id !== institution.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the key
    const { error } = await supabase.from('api_keys').delete().eq('id', key_id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete key.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'API key permanently deleted.' });

  } catch (e) {
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}
