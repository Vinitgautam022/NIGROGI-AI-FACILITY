import { NextResponse } from 'next/server';
import { destroyCurrentSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST() {
  await destroyCurrentSession();

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
  });
  return response;
}
