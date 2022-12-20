import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
              // start_date:,
              // end_date:,
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
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Token token=${this.$auth.api_token}`,
        // "User-Agent": "Pipedream",
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
      max,
    }) {
      let resourcesCount = 0;

      while (true) {
        const nextResponse = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs.params,
          },
        });

        if (!nextResponse) {
          return;
        }

        let nextResources = nextResponse.objects;

        // if (nextResponse.meta.next) {
        //   lastUrl = nextResponse.meta.next;
        // }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;
        }

        if (!nextResponse?.meta.next || (max && resourcesCount >= max)) {
          return;
        }
      }
    },
  },
};
