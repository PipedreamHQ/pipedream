import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "coinbase",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account",
      description: "The account to watch for changes",
      async options({ prevContext }) {
        const { path } = prevContext || {};
        const {
          pagination,
          data: accounts,
        } =
          await this.getAccounts({
            limit: 25,
            path,
          });

        const options = utils.getAccountOptions(accounts);

        return {
          options,
          context: {
            path: pagination.next_uri,
          },
        };
      },
    },
  },
  methods: {
    async _makeRequest(opts) {
      const {
        $,
        path,
        data,
        ...otherOpts
      } = opts;

      const requestPath =
        path.startsWith(constants.VERSION_PATH)
          ? path
          : `${constants.VERSION_PATH}${path}`;

      const url = `${constants.BASE_PATH}${requestPath}`;

      const authorization = `Bearer ${this.$auth.oauth_access_token}`;
      const headers = {
        ...otherOpts?.headers,
        authorization,
      };

      const config = {
        ...otherOpts,
        headers,
        url,
        data,
      };

      return await axios($ ?? this, config);
    },
    async getAccounts({
      $, path, limit,
    }) {
      return await this._makeRequest({
        $,
        path: path ?? "/accounts",
        params: {
          limit,
        },
      });
    },
    async getTransactions({
      $, path, accountId, limit, startingAfter,
    }) {
      return await this._makeRequest({
        $,
        path: path ?? `/accounts/${accountId}/transactions`,
        params: {
          limit,
          starting_after: startingAfter,
        },
      });
    },
  },
};
