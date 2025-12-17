import {
  useEffect,
  useRef,
} from "react";
import {
  useQuery, UseQueryResult,
} from "@tanstack/react-query";
import type {
  AppsListRequest,
  App,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";
import { isPaginatedPage } from "../utils/pagination";
import { usePaginatedSdkList } from "./use-paginated-sdk-list";

export type UseAppsResult = Omit<UseQueryResult<unknown, Error>, "data"> & {
  apps: App[];
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  loadMoreError?: Error;
};

/**
 * Get list of apps that can be authenticated with pagination support
 */
export const useApps = (input?: AppsListRequest): UseAppsResult => {
  const client = useFrontendClient();

  const {
    items: apps,
    hasMore,
    isLoadingMore,
    loadMore,
    loadMoreError,
    resetWithPage,
  } = usePaginatedSdkList<App>();

  const prevQueryDataRef = useRef<unknown>();

  const query = useQuery({
    queryKey: [
      "apps",
      input,
    ],
    queryFn: () => client.apps.list({
      limit: 50,
      ...input,
    }),
  });

  // Reset pagination ONLY when query data changes
  useEffect(() => {
    const inputKey = JSON.stringify(input ?? null);
    const hasNewData = prevQueryDataRef.current !== query.data;

    if (!query.data || !isPaginatedPage<App>(query.data) || !hasNewData) {
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
    apps,
    isLoadingMore,
    hasMore,
    loadMore,
    loadMoreError,
  };
};
