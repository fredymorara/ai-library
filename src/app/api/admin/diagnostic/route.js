import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { userId, orgId, getToken } = await auth();
    const clerkToken = await getToken({ template: 'supabase' });

    if (!clerkToken) {
      return NextResponse.json({ error: 'No token generated' });
    }

    // Decode the JWT payload without verifying signature just to see what's inside
    const payloadBase64 = clerkToken.split('.')[1];
    const payloadDecoded = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadDecoded);

    return NextResponse.json({
      userId,
      orgId,
      jwtPayload: payload
    });
  } catch (e) {
    return NextResponse.json({ error: e.message });
  }
}
