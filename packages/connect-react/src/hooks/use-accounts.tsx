import {
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useFrontendClient } from "./frontend-client-context";
import {
  type AccountsListRequest,
  type Account,
} from "@pipedream/sdk";

/**
 * Retrieves the list of accounts associated with the project.
 */
export const useAccounts = (
  input: {
    external_user_id?: string;
    app?: string;
    oauth_app_id?: string;
  },
  opts?: {
    useQueryOpts?: (Omit<
      UseQueryOptions<Account[]>,
      "queryKey" | "queryFn"
    > & { suspense?: boolean });
  },
) => {
  const client = useFrontendClient();
  const accountsListRequest: AccountsListRequest = {
    externalUserId: input.external_user_id,
    app: input.app,
    oauthAppId: input.oauth_app_id,
  };
  const query = useQuery({
    ...opts?.useQueryOpts,
    queryKey: [
      "accounts",
      input,
    ],
    queryFn: async () => {
      const response = await client.accounts.list(accountsListRequest);
      return response.data;
    },
  });

  return {
    ...query,
    accounts: query.data || [],
  };
};
