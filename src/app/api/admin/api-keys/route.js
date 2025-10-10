import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import crypto from 'crypto';

export const runtime = 'nodejs';

/**
 * Generate a secure API key
 */
function generateApiKey(institutionPrefix) {
  const randomPart = crypto.randomBytes(32).toString('hex');
  return `pk_live_${institutionPrefix}_${randomPart}`;
}

/**
 * GET /api/admin/api-keys - List all API keys for admin's institution
 */
export async function GET(request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Get institution ID
    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Get all API keys for this institution
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('id, key_prefix, name, is_active, rate_limit, created_at, last_used_at')
      .eq('institution_id', institution.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch API keys:', error);
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    return NextResponse.json({ apiKeys });

  } catch (e) {
    console.error('Error fetching API keys:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/api-keys - Generate a new API key
 */
export async function POST(request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, rateLimit = 1000 } = await request.json();

    const supabase = createServiceRoleClient();

    // Get institution ID
    let { data: institution } = await supabase
      .from('institutions')
      .select('id, name')
      .eq('clerk_org_id', orgId)
      .single();

    // Create institution if it doesn't exist
    if (!institution) {
      const { data: newInstitution, error: createError } = await supabase
        .from('institutions')
        .insert({
          clerk_org_id: orgId,
          name: orgId,
        })
        .select()
        .single();

      if (createError) {
        console.error('Failed to create institution:', createError);
        return NextResponse.json({ error: 'Failed to create institution' }, { status: 500 });
      }

      institution = newInstitution;
    }

    // Generate API key
    const institutionPrefix = institution.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 8);
    
    const apiKey = generateApiKey(institutionPrefix);
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 20) + '...'; // Show first 20 chars for display

    // Store API key
    const { data: newKey, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        institution_id: institution.id,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        name: name || 'Untitled Key',
        is_active: true,
        rate_limit: rateLimit,
        created_by: userId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create API key:', insertError);
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
    }

    // Return the full API key (ONLY TIME it's shown!)
    return NextResponse.json({
      apiKey: apiKey, // Full key - show to user once
      id: newKey.id,
      keyPrefix: keyPrefix,
      name: newKey.name,
      isActive: newKey.is_active,
      rateLimit: newKey.rate_limit,
      createdAt: newKey.created_at,
      warning: 'Save this API key now. You will not be able to see it again.'
    }, { status: 201 });

  } catch (e) {
    console.error('Error creating API key:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/api-keys/[id] - Revoke an API key
 */
export async function DELETE(request, { params }) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keyId = params.id;
    const supabase = createServiceRoleClient();

    // Get institution ID
    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Revoke the key (soft delete by setting is_active to false)
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId)
      .eq('institution_id', institution.id); // Ensure it belongs to this institution

    if (error) {
      console.error('Failed to revoke API key:', error);
      return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 });
    }

    return NextResponse.json({ message: 'API key revoked successfully' });

  } catch (e) {
    console.error('Error revoking API key:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
