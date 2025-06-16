import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import type { GetComponentOpts, V1Component } from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get list of components
 */
export const useComponents = (input?: GetComponentOpts) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "components",
      input?.app || "",
      input?.componentType || "",
      input?.q || "",
      input?.limit || 100,
      input?.after || "",
    ],
    queryFn: () => client.components(input),
    staleTime: 60000, // Consider data fresh for 1 minute
    gcTime: 300000, // Keep in cache for 5 minutes
  });

  return {
    ...query,
    components: query.data?.data || [],
  };
};

/**
 * Get list of components with pagination support
 */
export const useComponentsWithPagination = (input?: Omit<GetComponentOpts, 'limit' | 'after' | 'q'>) => {
  const client = useFrontendClient();
  const [allComponents, setAllComponents] = useState<V1Component[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Create stable query params object
  const queryParams = useCallback(() => ({
    ...input,
    limit: 50,
    after: cursor,
  }), [input?.app, input?.componentType, cursor]);

  const query = useQuery({
    queryKey: [
      "components-paginated",
      input?.app || "",
      input?.componentType || "",
      cursor || "",
    ],
    queryFn: () => client.components(queryParams()),
    staleTime: 60000, // Consider data fresh for 1 minute
    gcTime: 300000, // Keep in cache for 5 minutes
  });

  // Handle successful data fetch with cleanup guard
  useEffect(() => {
    let cancelled = false;

    if (query.isSuccess && query.data && !cancelled) {
      const data = query.data;
      
      if (cursor) {
        // This is a "load more" request, append to existing components
        setAllComponents(prev => {
          if (cancelled) return prev;
          const existingKeys = new Set(prev.map(c => c.key));
          const newComponents = data.data?.filter((c: V1Component) => !existingKeys.has(c.key)) || [];
          return [...prev, ...newComponents];
        });
      } else {
        // This is initial load, replace all components
        if (!cancelled) {
          setAllComponents(data.data || []);
        }
      }
      
      // Update pagination state
      if (!cancelled) {
        const pageInfo = data.page_info;
        setHasMore(pageInfo ? (pageInfo.count >= 50) : false);
        setIsLoadingMore(false);
      }
    }
    
    if (query.isError && !cancelled) {
      setIsLoadingMore(false);
    }

    return () => {
      cancelled = true;
    };
  }, [query.isSuccess, query.isError, query.data, cursor]);

  // Load more function - don't depend on entire query object
  const loadMore = useCallback(() => {
    if (hasMore && !query.isFetching && !isLoadingMore && query.data?.page_info?.end_cursor) {
      setIsLoadingMore(true);
      setCursor(query.data.page_info.end_cursor);
    }
  }, [hasMore, query.isFetching, query.data?.page_info?.end_cursor, isLoadingMore]);

  const reset = useCallback(() => {
    setAllComponents([]);
    setHasMore(true);
    setCursor(undefined);
    setIsLoadingMore(false);
  }, []);

  // Reset when input changes (e.g., different app or componentType)
  useEffect(() => {
    let cancelled = false;

    // Use a microtask to avoid state updates during render
    queueMicrotask(() => {
      if (!cancelled) {
        setAllComponents([]);
        setHasMore(true);
        setCursor(undefined);
        setIsLoadingMore(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [input?.app, input?.componentType]);

  return {
    ...query,
    components: allComponents,
    hasMore,
    loadMore,
    reset,
    isLoadingMore,
  };
};
