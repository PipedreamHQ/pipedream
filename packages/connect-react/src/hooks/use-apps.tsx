import { useQuery } from "@tanstack/react-query";
import type {
  AppsListRequest, App,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get list of apps that can be authenticated
 */
export const useApps = (input?: AppsListRequest): {
  apps: App[];
  isLoading: boolean;
  error: Error | null;
} => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "apps",
      input,
    ],
    queryFn: () => client.apps.list(input),
  });

  return {
    ...query,
    apps: query.data?.data || [],
  };
};
