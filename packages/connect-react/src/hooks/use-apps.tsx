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
      input?.q || "", // Stable key even if input is undefined
    ],
    queryFn: () => client.apps(input),
    staleTime: 60000, // Consider data fresh for 1 minute
    gcTime: 300000, // Keep in cache for 5 minutes (formerly cacheTime)
  });

  return {
    ...query,
    apps: query.data?.data || [],
  };
};
