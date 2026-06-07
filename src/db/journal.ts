import { openDB, type IDBPDatabase } from 'idb';

export type JournalEntry = {
  id?: number;
  createdAt: number;
  title: string;
  body: string;
  errorCode?: string;
  photos: string[]; // data URLs (base64)
};

const DB_NAME = 'robot-soldadura';
const DB_VERSION = 1;
const STORE = 'journal';

let dbPromise: Promise<IDBPDatabase> | null = null;

function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function listEntries(): Promise<JournalEntry[]> {
  const d = await db();
  const all = await d.getAllFromIndex(STORE, 'createdAt');
  return all.reverse() as JournalEntry[];
}

export async function getEntry(id: number): Promise<JournalEntry | undefined> {
  const d = await db();
  return (await d.get(STORE, id)) as JournalEntry | undefined;
}

export async function saveEntry(entry: JournalEntry): Promise<number> {
  const d = await db();
  const id = await d.put(STORE, entry);
  return id as number;
}

export async function deleteEntry(id: number): Promise<void> {
  const d = await db();
  await d.delete(STORE, id);
}
