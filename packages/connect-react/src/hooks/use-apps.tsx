import {
  useState, useCallback, useEffect, useRef,
} from "react";
import {
  useQuery, UseQueryResult,
} from "@tanstack/react-query";
import type {
  AppsListRequest, App,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

type UseAppsResult = Omit<UseQueryResult<any, Error>, "data"> & {
  apps: App[];
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
};

/**
 * Get list of apps that can be authenticated with pagination support
 */
export const useApps = (input?: AppsListRequest): UseAppsResult => {
  const client = useFrontendClient();
  const [
    allApps,
    setAllApps,
  ] = useState<App[]>([]);
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
  ] = useState<any>(null);

  // Track previous input to detect when query params actually change
  const prevInputRef = useRef<string>();

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

  // Reset pagination ONLY when query params change, not on refetches
  useEffect(() => {
    const inputKey = JSON.stringify(input);
    const isNewQuery = prevInputRef.current !== inputKey;

    if (query.data && isNewQuery) {
      prevInputRef.current = inputKey;
      setAllApps(query.data.data || []);
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
      const nextPageData = await nextPage.getNextPage();
      setAllApps((prev) => [
        ...prev,
        ...(nextPageData.data || []),
      ]);
      setHasMore(nextPageData.hasNextPage());
      setNextPage(nextPageData);
    } catch (err) {
      console.error("Error loading more apps:", err);
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
    apps: allApps,
    isLoadingMore,
    hasMore,
    loadMore,
  };
};
