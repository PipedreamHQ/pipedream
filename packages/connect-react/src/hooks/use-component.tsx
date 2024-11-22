import {
  useQuery, type UseQueryOptions,
} from "@tanstack/react-query";
import type { ComponentRequestResponse } from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get details about a component
 */
export const useComponent = (
  { key }: { key?: string; },
  opts?: {useQueryOpts?: Omit<UseQueryOptions<ComponentRequestResponse>, "queryKey" | "queryFn">;},
) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "component",
      key,
    ],
    queryFn: () => client.component({
      key: key!,
    }),
    enabled: !!key,
    ...opts?.useQueryOpts,
  });

  return {
    ...query,
    component: query.data?.data,
  };
};
