type StorageType = 'local' | 'session';

interface StorageSchema {
  [key: string]: (v: string) => unknown;
}

const JSON_RESOLVER = (v: string) => {
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

const STRING_RESOLVER = (v: string) => v;
const NUMBER_RESOLVER = (v: string) => Number(v);

const resolvers = {
  json: JSON_RESOLVER,
  string: STRING_RESOLVER,
  number: NUMBER_RESOLVER,
} as const;

type ResolverType = keyof typeof resolvers;

const getStorage = (type: StorageType): Storage =>
  type === 'local' ? localStorage : sessionStorage;

const listeners: Map<StorageType, Set<() => void>> = new Map();

function notify(type: StorageType) {
  listeners.get(type)?.forEach((fn) => fn());
}

function subscribe(fn: () => void, type: StorageType = 'local'): () => void {
  if (!listeners.has(type)) listeners.set(type, new Set());
  listeners.get(type)!.add(fn);
  return () => listeners.get(type)!.delete(fn);
}

const storageManager = {
  set(key: string, value: unknown, type: StorageType = 'local') {
    getStorage(type).setItem(key, JSON.stringify(value));
    notify(type);
  },

  get(key: string, type: StorageType = 'local'): unknown {
    const raw = getStorage(type).getItem(key);
    if (raw == null) return undefined;
    return JSON_RESOLVER(raw);
  },

  remove(key: string, type: StorageType = 'local') {
    getStorage(type).removeItem(key);
    notify(type);
  },

  clear(type: StorageType = 'local') {
    getStorage(type).clear();
    notify(type);
  },

  subscribe,
  resolvers,
};

export { storageManager };
export type { StorageType, ResolverType };
