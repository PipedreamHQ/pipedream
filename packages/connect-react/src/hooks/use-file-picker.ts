import { useState, useCallback, useEffect, useRef } from "react";
import {
  getFilePickerAdapter,
  type FileItem,
  type FilePickerAdapter,
  type ProxyRequestFn,
  type FilePickerContext,
  type FilePickerLevel,
} from "../adapters/file-picker";

export interface UseFilePickerOptions {
  app: string;
  accountId: string;
  externalUserId: string;
  proxyRequest: ProxyRequestFn;
  enabled?: boolean;
}

export interface UseFilePickerResult {
  path: FileItem[];
  items: FileItem[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  navigateInto: (item: FileItem) => void;
  navigateTo: (index: number) => void;
  navigateToRoot: () => void;
  loadMore: () => void;
  refresh: () => void;
}

interface CacheEntry {
  items: FileItem[];
  nextPageToken?: string;
  timestamp: number;
}

// Cache key for an item (or "root" for root level)
const getCacheKey = (item?: FileItem): string => {
  return item ? `item:${item.id}` : "root";
};

export function useFilePicker(options: UseFilePickerOptions): UseFilePickerResult {
  const { app, accountId, externalUserId, proxyRequest, enabled = true } = options;

  const [adapter, setAdapter] = useState<FilePickerAdapter | null>(null);
  const [path, setPath] = useState<FileItem[]>([]);
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  // Cache for prefetched data - persists across renders
  const cache = useRef<Map<string, CacheEntry>>(new Map());
  // Track in-flight prefetch requests to avoid duplicates
  const prefetchingRef = useRef<Set<string>>(new Set());

  // Initialize adapter
  useEffect(() => {
    try {
      const fileAdapter = getFilePickerAdapter(app);
      setAdapter(fileAdapter);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setAdapter(null);
    }
  }, [app]);

  // Create context for API calls
  const getContext = useCallback((): FilePickerContext => ({
    accountId,
    externalUserId,
    proxyRequest,
  }), [accountId, externalUserId, proxyRequest]);

  // Prefetch children for navigable items (fire and forget)
  const prefetchChildren = useCallback(
    (items: FileItem[], currentAdapter: FilePickerAdapter) => {
      const ctx = getContext();
      const navigableItems = items.filter(item => item.canNavigateInto);

      // Prefetch first few navigable items to avoid overwhelming the server
      const itemsToPrefetch = navigableItems.slice(0, 5);

      for (const item of itemsToPrefetch) {
        const cacheKey = getCacheKey(item);

        // Skip if already cached or already prefetching
        if (cache.current.has(cacheKey) || prefetchingRef.current.has(cacheKey)) {
          continue;
        }

        prefetchingRef.current.add(cacheKey);
        console.log(`[FilePicker] Prefetching: ${item.name}`);

        // Fire and forget - don't await
        currentAdapter.getChildren(ctx, item).then((result) => {
          cache.current.set(cacheKey, {
            items: result.items,
            nextPageToken: result.nextPageToken,
            timestamp: Date.now(),
          });
          console.log(`[FilePicker] Prefetched: ${item.name} (${result.items.length} items)`);
          prefetchingRef.current.delete(cacheKey);

          // Recursively prefetch one level deeper for first item only
          if (result.items.length > 0) {
            const firstNavigable = result.items.find(i => i.canNavigateInto);
            if (firstNavigable) {
              const deepKey = getCacheKey(firstNavigable);
              if (!cache.current.has(deepKey) && !prefetchingRef.current.has(deepKey)) {
                prefetchingRef.current.add(deepKey);
                currentAdapter.getChildren(ctx, firstNavigable).then((deepResult) => {
                  cache.current.set(deepKey, {
                    items: deepResult.items,
                    nextPageToken: deepResult.nextPageToken,
                    timestamp: Date.now(),
                  });
                  prefetchingRef.current.delete(deepKey);
                }).catch(() => {
                  prefetchingRef.current.delete(deepKey);
                });
              }
            }
          }
        }).catch(() => {
          prefetchingRef.current.delete(cacheKey);
        });
      }
    },
    [getContext]
  );

  // Fetch items for current level
  const fetchItems = useCallback(
    async (pageToken?: string) => {
      if (!adapter || !proxyRequest || !enabled) return;

      const currentItem = path[path.length - 1];
      const cacheKey = getCacheKey(currentItem);

      // Check cache first (only for initial load, not pagination)
      if (!pageToken) {
        const cached = cache.current.get(cacheKey);
        if (cached) {
          console.log(`[FilePicker] Cache HIT for: ${currentItem?.name || 'root'}`);
          setItems(cached.items);
          setNextPageToken(cached.nextPageToken);
          setLoading(false);
          setError(null);
          // Still prefetch children even when using cache
          prefetchChildren(cached.items, adapter);
          return;
        }
        console.log(`[FilePicker] Cache MISS for: ${currentItem?.name || 'root'}`);
      }

      const isLoadingMore = !!pageToken;
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setItems([]);
      }
      setError(null);

      const ctx = getContext();

      try {
        let result: FilePickerLevel;
        if (currentItem) {
          result = await adapter.getChildren(ctx, currentItem, pageToken);
        } else {
          result = await adapter.getRootItems(ctx, pageToken);
        }

        if (isLoadingMore) {
          setItems((prev) => {
            const newItems = [...prev, ...result.items];
            // Update cache with combined items
            cache.current.set(cacheKey, {
              items: newItems,
              nextPageToken: result.nextPageToken,
              timestamp: Date.now(),
            });
            return newItems;
          });
        } else {
          setItems(result.items);
          // Cache the result
          cache.current.set(cacheKey, {
            items: result.items,
            nextPageToken: result.nextPageToken,
            timestamp: Date.now(),
          });
        }
        setNextPageToken(result.nextPageToken);

        // Eagerly prefetch children for navigable items
        prefetchChildren(result.items, adapter);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [adapter, proxyRequest, path, enabled, getContext, prefetchChildren]
  );

  // Fetch when path changes
  useEffect(() => {
    if (enabled && adapter) {
      fetchItems();
    }
  }, [path, enabled, adapter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigation functions
  const navigateInto = useCallback((item: FileItem) => {
    if (item.canNavigateInto) {
      setPath((prev) => [...prev, item]);
    }
  }, []);

  const navigateTo = useCallback((index: number) => {
    if (index < 0) {
      setPath([]);
    } else {
      setPath((prev) => prev.slice(0, index + 1));
    }
  }, []);

  const navigateToRoot = useCallback(() => {
    setPath([]);
  }, []);

  const loadMore = useCallback(() => {
    if (nextPageToken && !loadingMore) {
      fetchItems(nextPageToken);
    }
  }, [nextPageToken, loadingMore, fetchItems]);

  const refresh = useCallback(() => {
    // Clear cache for current path and refetch
    const currentItem = path[path.length - 1];
    cache.current.delete(getCacheKey(currentItem));
    fetchItems();
  }, [path, fetchItems]);

  return {
    path,
    items,
    loading,
    loadingMore,
    error,
    hasMore: !!nextPageToken,
    navigateInto,
    navigateTo,
    navigateToRoot,
    loadMore,
    refresh,
  };
}
