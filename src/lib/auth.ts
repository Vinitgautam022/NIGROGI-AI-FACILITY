import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { createSession, createUser, deleteSession, getSessionByToken, getUserByEmail, getUserById } from '@/lib/database';

export const SESSION_COOKIE = 'vh_session';

export async function registerUser(name: string, email: string, password: string) {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('Account already exists with this email.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  return createUser({
    id: randomUUID(),
    name: name.trim(),
    email,
    passwordHash
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return null;
  }

  return user;
}

export async function issueSession(userId: string) {
  const token = randomUUID();
  await createSession({ id: randomUUID(), userId, token });
  return token;
}

export async function getCurrentUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = await getSessionByToken(token);
  if (!session) {
    return null;
  }

  return getUserById(session.userId);
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await deleteSession(token);
  }
}
