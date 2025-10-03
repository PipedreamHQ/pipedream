import {
  useQuery, type UseQueryOptions,
} from "@tanstack/react-query";
import type { GetComponentResponse } from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get details about a component
 */
export const useComponent = (
  { key }: { key?: string; },
  opts?: {useQueryOpts?: Omit<UseQueryOptions<GetComponentResponse>, "queryKey" | "queryFn">;},
) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "component",
      key,
    ],
    queryFn: () => client.components.retrieve(key!),
    enabled: !!key,
    ...opts?.useQueryOpts,
  });

  return {
    ...query,
    component: query.data?.data,
  };
};
