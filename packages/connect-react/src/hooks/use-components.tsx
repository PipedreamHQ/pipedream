import { useQuery } from "@tanstack/react-query";
import type { GetComponentOpts } from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get list of components
 */
export const useComponents = (input?: GetComponentOpts) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "components",
      input,
    ],
    queryFn: () => client.components(input),
  });

  return {
    ...query,
    components: query.data?.data || [],
  };
};
