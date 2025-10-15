import {
  useQuery, type UseQueryOptions,
} from "@tanstack/react-query";
import type { GetAppResponse } from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get details about an app
 */
export const useApp = (
  slug: string,
  opts?: { useQueryOpts?: (Omit<UseQueryOptions<GetAppResponse>, "queryKey" | "queryFn"> & { suspense?: boolean }) },
) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "app",
      slug,
    ],
    queryFn: () => client.apps.retrieve(slug),
    ...opts?.useQueryOpts,
  });

  return {
    ...query,
    app: query.data?.data,
  };
};
