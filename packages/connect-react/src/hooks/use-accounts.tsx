import {
  useQuery, UseQueryOptions,
} from "@tanstack/react-query";
import type {
  GetAccountOpts, AccountsRequestResponse,
} from "@pipedream/sdk";
import { useFrontendClient } from "./frontend-client-context";

/**
 * Retrieves the list of accounts associated with the project.
 */
export const useAccounts = (
  input: GetAccountOpts,
  opts?: {
    useQueryOpts?: Omit<
      UseQueryOptions<AccountsRequestResponse>,
      "queryKey" | "queryFn"
    >;
  },
) => {
  const client = useFrontendClient();
  const query = useQuery<AccountsRequestResponse>({
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
