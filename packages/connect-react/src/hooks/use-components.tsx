import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  useQuery, UseQueryResult,
} from "@tanstack/react-query";
import type {
  ComponentsListRequest,
  Component,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";
import {
  clonePaginatedPage,
  isPaginatedPage,
  PaginatedPage,
} from "../utils/pagination";

export type UseComponentsResult = Omit<UseQueryResult<unknown, Error>, "data"> & {
  components: Component[];
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  loadMoreError?: Error;
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
  ] = useState<PaginatedPage<Component> | null>(null);

  const [
    loadMoreError,
    setLoadMoreError,
  ] = useState<Error>();

  // Track previous query data and signature so we can reset safely
  const prevQueryDataRef = useRef<unknown>();
  const queryIdentityRef = useRef<{ inputKey: string; version: number }>();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  // Reset pagination ONLY when query data changes
  useEffect(() => {
    const inputKey = JSON.stringify(input ?? null);
    const hasNewData = prevQueryDataRef.current !== query.data;

    if (!query.data || !isPaginatedPage<Component>(query.data) || !hasNewData) {
      return;
    }

    prevQueryDataRef.current = query.data;
    const currentIdentity = queryIdentityRef.current;
    const nextVersion = currentIdentity
      ? currentIdentity.version + 1
      : 1;
    queryIdentityRef.current = {
      inputKey,
      version: nextVersion,
    };

    const pageData = clonePaginatedPage(query.data);
    setAllComponents([
      ...(pageData.data || []),
    ]);
    setHasMore(pageData.hasNextPage());
    setNextPage(pageData);
    setIsLoadingMore(false);
    setLoadMoreError(undefined);
  }, [
    query.data,
    input,
  ]);

  const loadMore = useCallback(async () => {
    if (!nextPage || !hasMore || isLoadingMore) return;

    const requestIdentity = queryIdentityRef.current;
    const requestVersion = requestIdentity?.version ?? 0;

    if (!isPaginatedPage<Component>(nextPage)) {
      setLoadMoreError(new Error("Next page response is not paginated"));
      return;
    }

    setIsLoadingMore(true);
    try {
      const nextPageData = await nextPage.getNextPage();
      if (!isMountedRef.current) {
        return;
      }
      if (requestVersion !== (queryIdentityRef.current?.version ?? 0)) {
        return;
      }
      setAllComponents((prev) => [
        ...prev,
        ...(nextPageData.data || []),
      ]);
      setHasMore(nextPageData.hasNextPage());
      setNextPage(nextPageData);
      setLoadMoreError(undefined);
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }
      if (requestVersion !== (queryIdentityRef.current?.version ?? 0)) {
        return;
      }
      const error = err instanceof Error
        ? err
        : new Error(String(err));
      setLoadMoreError(error);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingMore(false);
      }
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
    loadMoreError,
  };
};
