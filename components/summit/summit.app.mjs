import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "summit",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The identifier model to run in the format `:organization_slug/:external_id/:app_slug`",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext.next,
          }
          : {};
        const {
          apps, next,
        } = await this.listModels(args);
        return {
          options: apps?.map(({
            app_identifier: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            next,
          },
        };
      },
    },

  },
  methods: {
    _baseUrl() {
      return "https://api.usesummit.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    listModels(opts = {}) {
      return this._makeRequest({
        path: "/apps",
        ...opts,
      });
    },
    getModel({
      model, ...opts
    }) {
      return this._makeRequest({
        path: `/${model}/`,
        ...opts,
      });
    },
    runModel({
      model, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${model}/`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      resourceType,
      args = {},
      max,
    }) {
      let next, count = 0;
      do {
        const results = await resourceFn(args);
        const items = results[resourceType];
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        next = results?.next;
        args.url = next;
      } while (next);
    },
  },
};
