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
  });

  return {
    ...query,
    apps: query.data?.data || [],
  };
};
