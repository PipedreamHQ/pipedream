import { useQuery } from "@tanstack/react-query";
import type {
  ComponentsListRequest,
  Component,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get list of components
 */
export const useComponents = (input?: ComponentsListRequest): {
  components: Component[];
  isLoading: boolean;
  error: Error | null;
} => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "components",
      input,
    ],
    queryFn: () => client.components.list(input),
  });

  return {
    ...query,
    components: query.data?.data || [],
  };
};
