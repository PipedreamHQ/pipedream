import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "hotspotsystem",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location to get customers from.",
      async options({ prevContext }) {
        const { offset = 0 } = prevContext;
        const { items } = await this.listLocations({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset,
            fields: `${constants.FIELDS.ID},${constants.FIELDS.NAME}`,
          },
        });

        const options =
          items.map(({
            name: label, id: value,
          }) => ({
            label,
            value,
          }));

        return {
          options,
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "sn-apikey": this.$auth.api_key,
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

      return axios(step, config);
    },
    listLocations(args = {}) {
      return this.makeRequest({
        path: "/locations",
        ...args,
      });
    },
    async *getResourcesStream({
      resourcesFn,
      resourcesFnArgs,
      dateField,
      lastDate,
      max = constants.MAX_RESOURCES,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              offset,
            },
          });

        const { items: nextResources } = response;

        if (!nextResources?.length) {
          console.log("No more resources");
          return;
        }

        for (const resource of nextResources) {
          if (lastDate && Date.parse(resource[dateField]) < Date.parse(lastDate)) {
            return;
          }

          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        offset += constants.DEFAULT_LIMIT;
      }
    },
  },
};
