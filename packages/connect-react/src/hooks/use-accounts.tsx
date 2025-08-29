import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useFrontendClient } from "./frontend-client-context";
import type {
  GetAccountOpts,
  GetAccountsResponse,
} from "@pipedream/sdk";

/**
 * Retrieves the list of accounts associated with the project.
 */
export const useAccounts = (
  input: GetAccountOpts,
  opts?: {
    useQueryOpts?: Omit<
      UseQueryOptions<GetAccountsResponse>,
      "queryKey" | "queryFn"
    >;
  },
) => {
  const client = useFrontendClient();
  const query = useQuery<GetAccountsResponse>({
    ...opts?.useQueryOpts,
    queryKey: [
      "accounts",
      input,
    ],
    queryFn: () => client.getAccounts(input),
  });

  return {
    ...query,
    accounts: query.data?.data || [],
  };
};
