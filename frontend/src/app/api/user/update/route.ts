import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, role, organization } = await request.json();

    if (!fullName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        fullName,
        role,
        // Assuming organization name could map to something, but leaving it here if needed
        // The Prisma schema currently doesn't have organization name, maybe `school_id`?
        // Let's just update what we have.
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/user/update:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
