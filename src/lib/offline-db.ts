import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Product } from '@/types/shop';

interface OfflineDBSchema extends DBSchema {
  products: {
    key: string;
    value: Product;
    indexes: { 'by-category': string; 'by-slug': string };
  };
  categories: {
    key: string;
    value: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      icon: string | null;
      sort_order: number | null;
      count?: number;
    };
  };
  syncQueue: {
    key: number;
    value: {
      id?: number;
      type: 'cart' | 'favorite' | 'order';
      action: 'add' | 'remove' | 'update' | 'create';
      data: unknown;
      timestamp: number;
      retries: number;
    };
  };
  metadata: {
    key: string;
    value: {
      key: string;
      value: unknown;
      updatedAt: number;
    };
  };
}

const DB_NAME = 'spinride-offline';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OfflineDBSchema>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OfflineDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('by-category', 'category_id');
          productStore.createIndex('by-slug', 'slug');
        }

        // Categories store
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }

        // Sync queue for offline actions
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }

        // Metadata for cache timestamps
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

// Products operations
export async function cacheProducts(products: Product[]) {
  const db = await getDB();
  const tx = db.transaction('products', 'readwrite');
  await Promise.all([
    ...products.map(p => tx.store.put(p)),
    tx.done
  ]);
  await setMetadata('products_cached_at', Date.now());
}

export async function getCachedProducts(): Promise<Product[]> {
  const db = await getDB();
  return db.getAll('products');
}

export async function getCachedProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await getDB();
  return db.getFromIndex('products', 'by-slug', slug);
}

export async function getCachedProductsByCategory(categoryId: string): Promise<Product[]> {
  const db = await getDB();
  return db.getAllFromIndex('products', 'by-category', categoryId);
}

// Categories operations
export async function cacheCategories(categories: Array<{
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
  count?: number;
}>) {
  const db = await getDB();
  const tx = db.transaction('categories', 'readwrite');
  await Promise.all([
    ...categories.map(c => tx.store.put(c)),
    tx.done
  ]);
  await setMetadata('categories_cached_at', Date.now());
}

export async function getCachedCategories() {
  const db = await getDB();
  return db.getAll('categories');
}

// Sync queue operations
export async function addToSyncQueue(item: Omit<OfflineDBSchema['syncQueue']['value'], 'id' | 'timestamp' | 'retries'>) {
  const db = await getDB();
  await db.add('syncQueue', {
    ...item,
    timestamp: Date.now(),
    retries: 0,
  });
}

export async function getSyncQueue() {
  const db = await getDB();
  return db.getAll('syncQueue');
}

export async function removeFromSyncQueue(id: number) {
  const db = await getDB();
  await db.delete('syncQueue', id);
}

export async function incrementSyncRetry(id: number) {
  const db = await getDB();
  const item = await db.get('syncQueue', id);
  if (item) {
    item.retries += 1;
    await db.put('syncQueue', item);
  }
}

export async function clearSyncQueue() {
  const db = await getDB();
  await db.clear('syncQueue');
}

// Metadata operations
export async function setMetadata(key: string, value: unknown) {
  const db = await getDB();
  await db.put('metadata', { key, value, updatedAt: Date.now() });
}

export async function getMetadata<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  const item = await db.get('metadata', key);
  return item?.value as T | undefined;
}

// Cache freshness check (1 hour default)
export async function isCacheStale(key: string, maxAge = 60 * 60 * 1000): Promise<boolean> {
  const cachedAt = await getMetadata<number>(`${key}_cached_at`);
  if (!cachedAt) return true;
  return Date.now() - cachedAt > maxAge;
}

// Clear all offline data
export async function clearAllOfflineData() {
  const db = await getDB();
  await Promise.all([
    db.clear('products'),
    db.clear('categories'),
    db.clear('metadata'),
  ]);
}
