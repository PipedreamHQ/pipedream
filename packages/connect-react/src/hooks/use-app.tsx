import {
  useQuery, type UseQueryOptions,
} from "@tanstack/react-query";
import { useFrontendClient } from "./frontend-client-context";
import type { AppRequestResponse } from "@pipedream/sdk";

/**
 * Get details about an app
 */
export const useApp = (slug: string, opts?:{ useQueryOpts?: Omit<UseQueryOptions<AppRequestResponse>, "queryKey" | "queryFn">;}) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "app",
      slug,
    ],
    queryFn: () => client.app(slug),
    ...opts?.useQueryOpts,
  });

  return {
    ...query,
    app: query.data?.data,
  };
};
