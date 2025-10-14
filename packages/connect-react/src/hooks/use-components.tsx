import {
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
import { isPaginatedPage } from "../utils/pagination";
import { usePaginatedSdkList } from "./use-paginated-sdk-list";

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

  const {
    items: allComponents,
    hasMore,
    isLoadingMore,
    loadMore,
    loadMoreError,
    resetWithPage,
  } = usePaginatedSdkList<Component>();

  const prevQueryDataRef = useRef<unknown>();

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
    resetWithPage(query.data, inputKey);
  }, [
    query.data,
    input,
    resetWithPage,
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
