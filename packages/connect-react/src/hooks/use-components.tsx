import { useQuery } from "@tanstack/react-query";
import type { GetComponentsOpts } from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Get list of components
 */
export const useComponents = (input?: GetComponentsOpts) => {
  const client = useFrontendClient();
  const query = useQuery({
    queryKey: [
      "components",
      input,
    ],
    queryFn: () => client.getComponents(input),
  });

  return {
    ...query,
    components: query.data?.data || [],
  };
};
