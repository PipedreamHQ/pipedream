import {
  useState, useCallback, useEffect, useRef,
} from "react";
import {
  useQuery, UseQueryResult,
} from "@tanstack/react-query";
import type {
  ComponentsListRequest,
  Component,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

export type UseComponentsResult = Omit<UseQueryResult<unknown, Error>, "data"> & {
  components: Component[];
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
};

/**
 * Get list of components with pagination support
 */
export const useComponents = (input?: ComponentsListRequest): UseComponentsResult => {
  const client = useFrontendClient();
  const [
    allComponents,
    setAllComponents,
  ] = useState<Component[]>([]);
  const [
    hasMore,
    setHasMore,
  ] = useState(false);
  const [
    isLoadingMore,
    setIsLoadingMore,
  ] = useState(false);
  const [
    nextPage,
    setNextPage,
  ] = useState<unknown>(null);

  // Track previous input to detect when query params actually change
  const prevInputRef = useRef<string>();

  const query = useQuery({
    queryKey: [
      "components",
      input,
    ],
    queryFn: () => client.components.list({
      limit: 50,
      ...input,
    }),
  });

  // Reset pagination ONLY when query params change, not on refetches
  useEffect(() => {
    const inputKey = JSON.stringify(input ?? null);
    const isNewQuery = prevInputRef.current !== inputKey;

    if (query.data && isNewQuery) {
      prevInputRef.current = inputKey;
      setAllComponents(query.data.data || []);
      setHasMore(query.data.hasNextPage());
      setNextPage(query.data);
      setIsLoadingMore(false);
    }
  }, [
    query.data,
    input,
  ]);

  const loadMore = useCallback(async () => {
    if (!nextPage || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nextPageData = await (nextPage as any).getNextPage();
      setAllComponents((prev) => [
        ...prev,
        ...(nextPageData.data || []),
      ]);
      setHasMore(nextPageData.hasNextPage());
      setNextPage(nextPageData);
    } catch (err) {
      console.error("Error loading more components:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    nextPage,
    hasMore,
    isLoadingMore,
  ]);

  return {
    ...query,
    components: allComponents,
    isLoadingMore,
    hasMore,
    loadMore,
  };
};
