import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import method from "./common/method.mjs";

export default {
  type: "app",
  app: "baselinker",
  propDefinitions: {
    inventoryId: {
      type: "string",
      label: "Inventory ID",
      description: "The ID of the inventory.",
      async options() {
        const response = await this.listInventories();
        console.log("response!!!", JSON.stringify(response, null, 2));
        return response?.inventories?.map(({
          inventory_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "X-BLToken": this.$auth.api_key,
        ...headers,
      };
    },
    getData({
      method, parameters,
    } = {}) {
      if (!method) {
        throw new Error("method property is required in data request");
      }
      const init = parameters
        ? {
          method,
          parameters: JSON.stringify(parameters),
        }
        : {
          method,
        };

      const params = new URLSearchParams(init);
      return params.toString();
    },
    makeRequest({
      step = this, path, headers, url, data, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        data: this.getData(data),
        ...args,
      };

      console.log("config!!!", JSON.stringify(config, null, 2));
      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    connector(args = {}) {
      return this.post({
        path: "/connector.php",
        ...args,
      });
    },
    listInventories(args = {}) {
      return this.connector({
        ...args,
        data: {
          method: method.GET_INVENTORIES,
          ...args.data,
        },
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      lastCreatedAt,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              page,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const dateFilter =
            lastCreatedAt
            && Date.parse(resource.created_at) > Date.parse(lastCreatedAt);

          if (!lastCreatedAt || dateFilter) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            return;
          }
        }

        page += 1;
      }
    },
  },
};
