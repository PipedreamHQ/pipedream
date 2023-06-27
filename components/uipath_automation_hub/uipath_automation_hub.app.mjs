import { axios } from "@pipedream/platform";
import { prepareCategories } from "./common/utils.mjs";

export default {
  type: "app",
  app: "uipath_automation_hub",
  propDefinitions: {
    categoryId: {
      type: "integer",
      label: "Category Id",
      description: "The Id of the category.",
      async options({ page }) {
        const { data: { categories } } = await this.listCategories({
          params: {
            page,
          },
        });

        return prepareCategories(categories);
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://automation-hub.uipath.com/api/v1/openapi";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.tenant_id}/${this.$auth.token}`,
        "x-ah-openapi-auth": "openapi-token",
        "x-ah-openapi-app-key": this.$auth.app_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      console.log("config: ", config);

      return axios($, config);
    },
    listCategories(args = {}) {
      return this._makeRequest({
        path: "hierarchy",
        ...args,
      });
    },
    /*async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          meta: {
            current_page, last_page,
          },
        } = await fn(params);
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = !(current_page == last_page);

      } while (lastPage);
    },*/
  },
};
