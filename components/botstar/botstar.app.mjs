import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "botstar",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot to use for the request",
      async options() {
        const bots = await this.listBots();
        return bots?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    entityId: {
      type: "string",
      label: "CMS Entity ID",
      description: "The ID of the CMS entity to use for the request",
      async options({ botId }) {
        const cmsEntities = await this.listCmsEntities({
          botId,
        });
        return cmsEntities?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://apis.botstar.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
        ...opts,
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bots",
        ...opts,
      });
    },
    listCmsEntities({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/bots/${botId}/cms_entities`,
        ...opts,
      });
    },
    listCmsEntityItems({
      botId, entityId, ...opts
    }) {
      return this._makeRequest({
        path: `/bots/${botId}/cms_entities/${entityId}/items`,
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
          limit: 100,
        },
      };
      let total, count = 1;
      do {
        const items = await fn(args);
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = items?.length;
        args.params.page++;
      } while (total === args.params.limit);
    },
  },
};
