import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export type DbUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type DbSession = {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
};

type DbSchema = {
  users: DbUser[];
  sessions: DbSession[];
};

const DEFAULT_DB: DbSchema = {
  users: [],
  sessions: []
};

let dbInstance: Low<DbSchema> | null = null;

async function ensureDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), '.data');
  await mkdir(dataDir, { recursive: true });

  const file = path.join(dataDir, 'virtual-hospital-db.json');
  const adapter = new JSONFile<DbSchema>(file);
  const db = new Low<DbSchema>(adapter, DEFAULT_DB);
  await db.read();
  db.data = db.data ?? DEFAULT_DB;

  dbInstance = db;
  return db;
}

export async function getUserByEmail(email: string) {
  const db = await ensureDb();
  const normalized = email.trim().toLowerCase();
  return db.data.users.find((user) => user.email === normalized) ?? null;
}

export async function getUserById(id: string) {
  const db = await ensureDb();
  return db.data.users.find((user) => user.id === id) ?? null;
}

export async function createUser(user: Omit<DbUser, 'createdAt'>) {
  const db = await ensureDb();
  const payload: DbUser = {
    ...user,
    email: user.email.trim().toLowerCase(),
    createdAt: new Date().toISOString()
  };
  db.data.users.push(payload);
  await db.write();
  return payload;
}

export async function createSession(session: Omit<DbSession, 'createdAt'>) {
  const db = await ensureDb();
  const payload: DbSession = {
    ...session,
    createdAt: new Date().toISOString()
  };
  db.data.sessions.push(payload);
  await db.write();
  return payload;
}

export async function getSessionByToken(token: string) {
  const db = await ensureDb();
  return db.data.sessions.find((session) => session.token === token) ?? null;
}

export async function deleteSession(token: string) {
  const db = await ensureDb();
  db.data.sessions = db.data.sessions.filter((session) => session.token !== token);
  await db.write();
}
