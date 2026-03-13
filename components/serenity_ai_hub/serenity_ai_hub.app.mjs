import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "serenity_ai_hub",
  propDefinitions: {
    agentCode: {
      type: "string",
      label: "Agent Code",
      description: "The unique identifier code of the agent",
      async options({ page }) {
        const response = await this.getAllAgents({
          params: {
            page: page + 1,
            pageSize: 20,
          },
        });
        const agents = response?.items ?? [];
        return agents.map((agent) => ({
          label: agent.name || agent.code,
          value: agent.code,
        }));
      },
    },
    culture: {
      type: "string",
      label: "Culture",
      description: "Overrides the response language",
      optional: true,
      options: [
        {
          label: "English",
          value: "en",
        },
        {
          label: "Spanish",
          value: "es",
        },
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.serenitystar.ai/api/v2${path}`;
    },
    getHeaders(headers) {
      return {
        "content-type": "application/json-patch+json",
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...opts,
      });
    },
    getAllAgents(opts = {}) {
      return this._makeRequest({
        path: "/agent",
        ...opts,
      });
    },
    getConversationInfo({
      agentCode, ...opts
    }) {
      return this._makeRequest({
        path: `/Agent/${agentCode}/conversation/info`,
        method: "POST",
        ...opts,
      });
    },
    executeAgent({
      agentCode, ...opts
    }) {
      return this._makeRequest({
        path: `/agent/${agentCode}/execute`,
        method: "POST",
        ...opts,
      });
    },
    async getPaginatedResources(args) {
      const items = [];
      for await (const item of this.paginate(args)) {
        items.push(item);
      }
      return items;
    },
    async *paginate({
      resourcesFn, resourcesFnArgs, max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let count = 0;
      const pageSize = constants.DEFAULT_LIMIT;

      while (true) {
        const response = await resourcesFn({
          ...resourcesFnArgs,
          params: {
            ...resourcesFnArgs?.params,
            page,
            pageSize,
          },
        });

        const items = response?.items ?? [];

        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }

        if (items.length < pageSize) {
          return;
        }
        page++;
      }
    },
  },
};
