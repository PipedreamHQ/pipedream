import {
  PlaidApi,
  Configuration,
} from "plaid";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "plaid",
  propDefinitions: {
    accessToken: {
      type: "string",
      label: "Access Token",
      description: "The access token associated with the Item data is being requested for.",
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The specific account ID to filter by.",
      optional: true,
      async options({ accessToken }) {
        if (!accessToken) {
          return [];
        }

        const { accounts } = await this.getAccounts({
          access_token: accessToken,
        });
        return accounts.map(({
          account_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The earliest date for which to fetch transaction data. Dates should be formatted as `YYYY-MM-DD`.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The latest date for which to fetch transaction data. Dates should be formatted as `YYYY-MM-DD`.",
    },
    publicToken: {
      type: "string",
      label: "Public Token",
      description: "Your `public_token`, obtained from the Link `onSuccess` callback or **Create Sandbox Public Token** action component.",
    },
    products: {
      type: "string[]",
      label: "Products",
      description: "List of Plaid product(s) you wish to use. If launching Link in update mode, should be omitted (unless you are using update mode to add Income or Assets to an Item); required otherwise. [See the documentation](https://plaid.com/docs/api/link/#link-token-create-request-products).",
      optional: true,
      options: [
        "assets",
        "auth",
        "beacon",
        "employment",
        "identity",
        "income_verification",
        "identity_verification",
        "investments",
        "liabilities",
        "payment_initiation",
        "standing_orders",
        "signal",
        "statements",
        "transactions",
        "transfer",
        "cra_base_report",
        "cra_income_insights",
        "cra_partner_insights",
        "cra_network_insights",
        "cra_cashflow_insights",
        "layer",
      ],
    },
    requiredIfSupportedProducts: {
      type: "string[]",
      label: "Required If Supported Products",
      description: "List of Plaid product(s) you wish to use only if the institution and account(s) selected by the user support the product. Institutions that do not support these products will still be shown in Link. The products will only be extracted and billed if the user selects an institution and account type that supports them. [See the documentation](https://plaid.com/docs/api/link/#link-token-create-request-required-if-supported-products).",
      optional: true,
      options: [
        "auth",
        "identity",
        "investments",
        "liabilities",
        "transactions",
        "signal",
        "statements",
      ],
    },
    optionalProducts: {
      type: "string[]",
      label: "Optional Products",
      description: "List of Plaid product(s) that will enhance the consumer's use case, but that your app can function without. Plaid will attempt to fetch data for these products on a best-effort basis, and failure to support these products will not affect Item creation. [See the documentation](https://plaid.com/docs/api/link/#link-token-create-request-optional-products).",
      optional: true,
      options: [
        "auth",
        "identity",
        "investments",
        "liabilities",
        "signal",
        "statements",
        "transactions",
      ],
    },
    additionalConsentedProducts: {
      type: "string[]",
      label: "Additional Consented Products",
      description: "List of additional Plaid product(s) you wish to collect consent for to support your use case. These products will not be billed until you start using them by calling the relevant endpoints. [See the documentation](https://plaid.com/docs/api/link/#link-token-create-request-additional-consented-products).",
      optional: true,
      options: [
        "auth",
        "balance_plus",
        "identity",
        "investments",
        "liabilities",
        "transactions",
        "signal",
      ],
    },
  },
  methods: {
    getConf() {
      const {
        client_id: clientId,
        client_secret: clientSecret,
        environment: basePath,
      } = this.$auth;
      return new Configuration({
        basePath,
        baseOptions: {
          headers: {
            "PLAID-CLIENT-ID": clientId,
            "PLAID-SECRET": clientSecret,
          },
        },
      });
    },
    getClient() {
      return new PlaidApi(this.getConf());
    },
    async makeRequest({
      method, debug = false, otherOptions, ...args
    } = {}) {
      if (debug) {
        console.log("Request args", args);
        console.log("Request otherOptions", otherOptions);
        console.log("Request method", method);
      }

      if (!method) {
        throw new Error("Method is required");
      }

      const client = this.getClient();
      try {
        const response = await client[method](args, otherOptions);

        if (debug) {
          console.log("Response", response);
        }

        if (response.status !== 200) {
          console.log("Status error", response);
          throw new Error(`Status error: ${response.status} ${response.statusText}`);
        }

        return response?.data;
      } catch (error) {
        console.error("Error making request", error.response);
        throw new Error(JSON.stringify(error.response.data, null, 2));
      }
    },
    createSandboxPublicToken(args = {}) {
      return this.makeRequest({
        method: "sandboxPublicTokenCreate",
        ...args,
      });
    },
    exchangePublicToken(args = {}) {
      return this.makeRequest({
        method: "itemPublicTokenExchange",
        ...args,
      });
    },
    getAccountsBalance(args = {}) {
      return this.makeRequest({
        method: "accountsBalanceGet",
        ...args,
      });
    },
    getTransactions(args = {}) {
      return this.makeRequest({
        method: "transactionsGet",
        ...args,
      });
    },
    getAccounts(args = {}) {
      return this.makeRequest({
        method: "accountsGet",
        ...args,
      });
    },
    createLinkToken(args = {}) {
      return this.makeRequest({
        method: "linkTokenCreate",
        ...args,
      });
    },
    getLinkToken(args = {}) {
      return this.makeRequest({
        method: "linkTokenGet",
        ...args,
      });
    },
    createUser(args = {}) {
      return this.makeRequest({
        method: "userCreate",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            options: {
              ...resourcesFnArgs?.options,
              count: constants.DEFAULT_LIMIT,
              offset,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && Date.parse(resource[dateField]) >= Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        offset += constants.DEFAULT_LIMIT;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
