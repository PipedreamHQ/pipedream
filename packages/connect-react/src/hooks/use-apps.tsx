import { useQuery } from "@tanstack/react-query";
import type { GetAppsOpts } from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get list of apps that can be authenticated
 */
export const useApps = (input?: GetAppsOpts) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "apps",
      input,
    ],
    queryFn: () => client.apps(input),
//    keepPreviousData: true,
//    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
//    cacheTime: 1000 * 60 * 10, // Keep cache for 10 minutes
  });

  return {
    ...query,
    apps: query.data?.data || [],
  };
};
