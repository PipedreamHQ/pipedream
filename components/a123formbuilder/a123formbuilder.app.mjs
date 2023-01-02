import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "a123formbuilder",
  propDefinitions: {
    form: {
      type: "integer",
      label: "Form",
      description: "The id of a form",
      async options({ prevContext }) {
        const response = await this.getForms({
          params: {
            limit: constants.ASYNC_OPTIONS_LIMIT,
            page: prevContext?.nextPage,
          },
        });
        return {
          options: response.data.map((form) => ({
            label: form.name,
            value: form.id,
          })),
          context: {
            nextPage: this.getCurrentPage(response) + 1,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this._location()}.123formbuilder.com/v2`;
    },
    _location() {
      return this.$auth.location === "US"
        ? "api"
        : "eu-api";
    },
    _auth() {
      return this.$auth.token;
    },
    getCurrentPage(response) {
      return response.meta.pagination.current_page;
    },
    isLastPage(response) {
      return this.getCurrentPage(response) === response.meta.pagination.total_pages;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        params: {
          ...opts.params,
          JWT: this._auth(),
        },
      });
    },
    async getForms({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.getForms,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/forms",
      });
    },
    async getFormResponses({
      paginate = false, form, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.getFormResponses,
          form,
        });
      }
      return this._makeRequest({
        ...opts,
        path: `/forms/${form}/submissions`,
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        per_page: 1000,
        page: 1,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response.data);
        opts.params.page++;

        if (this.isLastPage(response)) {
          return {
            data,
          };
        }
      }
    },
  },
};
