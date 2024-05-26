import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "insighto_ai",
  propDefinitions: {
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "The ID of the assistant.",
      async options({ page }) {
        const { data: { items } } = await this.listAssistants({
          params: {
            page: page + 1,
          },
        });
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    widgetId: {
      type: "string",
      label: "Widget ID",
      description: "The ID of the widget.",
      async options({ page }) {
        const { data: { items } } = await this.listWidgets({
          params: {
            page: page + 1,
          },
        });
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization.",
      async options({ page }) {
        const { data: { items } } = await this.listUserOrgs({
          params: {
            page: page + 1,
          },
        });
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    dataSourceId: {
      type: "string",
      label: "Data Source ID",
      description: "The ID of the target data source.",
      async options({ page }) {
        const { data: { items } } = await this.listDataSources({
          params: {
            page: page + 1,
          },
        });
        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    dataSourceType: {
      type: "string",
      label: "Data Source Type",
      description: "The type of the data source.",
      async options({ dataSourceId }) {
        const { data: { ds_type: dsType } } = await this.getDataSource({
          dataSourceId,
        });
        return [
          dsType,
        ];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "accept": "application/json",
      };
    },
    getAuthParams(params) {
      return {
        ...params,
        "api_key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, params, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        params: this.getAuthParams(params),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listAssistants(args = {}) {
      return this._makeRequest({
        path: "/assistant/list",
        ...args,
      });
    },
    listWidgets(args = {}) {
      return this._makeRequest({
        path: "/widget/list",
        ...args,
      });
    },
    listUserOrgs(args = {}) {
      return this._makeRequest({
        path: "/user/list/orgs",
        ...args,
      });
    },
    listDataSources(args = {}) {
      return this._makeRequest({
        path: "/datasource/list",
        ...args,
      });
    },
    getDataSource({
      dataSourceId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/datasource/${dataSourceId}`,
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contact/list",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (resourcesCount >= response.total) {
          console.log("There are no more resources to fetch");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
