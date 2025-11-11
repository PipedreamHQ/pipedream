import {
  useCallback,
  useRef,
  useState,
} from "react";
import {
  clonePaginatedPage,
  PaginatedPage,
} from "../utils/pagination";
import { useMountedRef } from "./use-mounted-ref";

export type PaginatedSdkListState<T> = {
  items: T[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreError?: Error;
  loadMore: () => Promise<void>;
  resetWithPage: (page: PaginatedPage<T>, identityKey: string) => void;
};

type QueryIdentity = {
  version: number;
};

export function usePaginatedSdkList<T>(): PaginatedSdkListState<T> {
  const [
    items,
    setItems,
  ] = useState<T[]>([]);
  const [
    hasMore,
    setHasMore,
  ] = useState(false);
  const [
    isLoadingMore,
    setIsLoadingMore,
  ] = useState(false);
  const [
    loadMoreError,
    setLoadMoreError,
  ] = useState<Error>();

  const pageRef = useRef<PaginatedPage<T> | null>(null);
  const identityRef = useRef<QueryIdentity>();
  const isMountedRef = useMountedRef();

  const resetWithPage = useCallback((page: PaginatedPage<T>, _identityKey: string) => {
    const clone = clonePaginatedPage(page);
    const nextVersion = (identityRef.current?.version ?? 0) + 1;

    identityRef.current = {
      version: nextVersion,
    };
    pageRef.current = clone;

    const nextItems = clone.data
      ? clone.data.slice()
      : [];
    setItems(nextItems);
    setHasMore(clone.hasNextPage());
    setIsLoadingMore(false);
    setLoadMoreError(undefined);
  }, []);

  const loadMore = useCallback(async () => {
    const activeIdentity = identityRef.current;
    const activePage = pageRef.current;

    if (
      !activeIdentity
      || !activePage
      || !hasMore
      || isLoadingMore
    ) {
      return;
    }

    const requestVersion = activeIdentity.version;
    setIsLoadingMore(true);

    try {
      const nextPage = await activePage.getNextPage();
      if (!isMountedRef.current) {
        return;
      }

      if (requestVersion !== (identityRef.current?.version ?? 0)) {
        return;
      }

      const clone = clonePaginatedPage(nextPage);
      pageRef.current = clone;
      setItems((prev) => {
        if (!clone.data || clone.data.length === 0) {
          return prev;
        }

        return prev.concat(clone.data);
      });
      setHasMore(clone.hasNextPage());
      setLoadMoreError(undefined);
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }

      if (requestVersion !== (identityRef.current?.version ?? 0)) {
        return;
      }

      setLoadMoreError(err instanceof Error
        ? err
        : new Error(String(err)));
    } finally {
      if (
        isMountedRef.current
        && requestVersion === (identityRef.current?.version ?? 0)
      ) {
        setIsLoadingMore(false);
      }
    }
  }, [
    hasMore,
    isLoadingMore,
    isMountedRef,
  ]);

  return {
    items,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    resetWithPage,
  };
}
