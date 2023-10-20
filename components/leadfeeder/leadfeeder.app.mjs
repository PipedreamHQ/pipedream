import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "leadfeeder",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "ID of the account the custom feed belongs to",
      async options() {
        const { data: accounts } = await this.getAccounts();
        return accounts.map(({
          id: value, attributes,
        }) => ({
          label: attributes.name,
          value,
        }));
      },
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "ID of the lead to retrieve",
      async options({
        accountId, page,
      }) {
        const { data: leads } =
          await this.getLeads({
            accountId,
            params: {
              start_date: utils.getFormatDate(30),
              end_date: utils.getFormatDate(),
              [constants.PARAM.PAGE_NUMBER]: page + 1,
              [constants.PARAM.PAGE_SIZE]: constants.DEFAULT_LIMIT,
            },
          });
        return leads.map(({
          id: value, attributes,
        }) => ({
          label: attributes.name,
          value,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Token token=${this._apiToken()}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      try {
        return await axios(step, config);
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
    getAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    getLeads({
      accountId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}/leads`,
        ...args,
      });
    },
    getLead({
      accountId, leadId, ...args
    }) {
      return this.makeRequest({
        path: `/accounts/${accountId}/leads/${leadId}`,
        ...args,
      });
    },
    getLeadVisits({
      accountId, leadId, ...args
    }) {
      return this.makeRequest({
        path: `/accounts/${accountId}/leads/${leadId}/visits`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const { data: nextResources } = await resourceFn({
          ...resourceFnArgs,
          params: {
            [constants.PARAM.PAGE_SIZE]: constants.DEFAULT_LIMIT,
            [constants.PARAM.PAGE_NUMBER]: page,
            ...resourceFnArgs.params,
          },
        });

        if (!nextResources?.length) {
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;
        }

        page += 1;

        if (resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
