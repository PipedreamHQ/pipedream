import { axios } from "@pipedream/platform";
import {
  DOCUMENTATION_OPTIONS,
  INPUT_QUALITY_OPTIONS,
  INPUT_TYPE_OPTIONS,
  RULES_OPTIONS,
  STABILITY_OPTIONS,
} from "./common/constants.mjs";
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
    documentation: {
      type: "integer",
      label: "Documentation",
      description: "Do you have any documentation regarding this process/activity?",
      options: DOCUMENTATION_OPTIONS,
    },
    automationId: {
      type: "integer",
      label: "Idea Id",
      description: "The Id of the idea.",
      async options({ page }) {
        const { data: { processes } } = await this.listAutomations({
          params: {
            page,
          },
        });

        return processes.map(({
          process_id: value, process_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    inputQuality: {
      type: "integer",
      label: "Input Quality",
      description: "How would you describe the structure of your input data?",
      options: INPUT_QUALITY_OPTIONS,
    },
    inputType: {
      type: "integer",
      label: "Input Type",
      description: "How would you describe the input data for your task/process?",
      options: INPUT_TYPE_OPTIONS,
    },
    processDescription: {
      type: "string",
      label: "Process Description",
      description: "Description of the idea.",
    },
    processName: {
      type: "string",
      label: "Process Name",
      description: "Name of the idea.",
    },
    rules: {
      type: "integer",
      label: "Rules",
      description: "How rule-based is your task?",
      options: RULES_OPTIONS,
    },
    stability: {
      type: "integer",
      label: "Stability",
      description: "Are you aware of any expected changes to the way you currently perform the activity or process in the following 6 months?",
      options: STABILITY_OPTIONS,
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

      return axios($, config);
    },
    authInfo() {
      return this._makeRequest({
        path: "authinfo",
      });
    },
    createIdea(args = {}) {
      return this._makeRequest({
        path: "automationidea",
        method: "POST",
        ...args,
      });
    },
    listCategories(args = {}) {
      return this._makeRequest({
        path: "hierarchy",
        ...args,
      });
    },
    listAutomations(args = {}) {
      return this._makeRequest({
        path: "automations",
        ...args,
      });
    },
    updateIdea({
      automationId, ...args
    }) {
      return this._makeRequest({
        path: `automations/${automationId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateCategoryIdea({
      automationId, ...args
    }) {
      return this._makeRequest({
        path: `automation/${automationId}/categories`,
        method: "PUT",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasNextPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data: {
            page: currentPage,
            totalPages,
            processes,
          },
        } = await fn({
          params,
        });
        for (const d of processes) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasNextPage = !(currentPage == totalPages);

      } while (hasNextPage);
    },
  },
};
