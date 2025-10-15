import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "linearb",
  propDefinitions: {
    teams: {
      type: "string[]",
      label: "Teams",
      description: "The list of LinearB teams names related to this incident. (lowercase only)",
      async options({ page }) {
        const { items } = await this.getTeams({
          params: {
            page,
          },
        });

        return items.map(({ name }) => name);
      },
    },
    services: {
      type: "string[]",
      label: "Services",
      description: "The list of LinearB services related to this incident. (lowercase only)",
      async options({ page }) {
        const { items } = await this.getServices({
          params: {
            page,
          },
        });

        return items.map(({ name }) => name);
      },
    },
  },
  methods: {
    getUrl(path, versionPath = constants.VERSION_PATH.V1) {
      return `${constants.BASE_URL}${versionPath}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, versionPath, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, versionPath),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listDeployments(args = {}) {
      return this._makeRequest({
        path: "/deployments",
        ...args,
      });
    },
    getTeams(args = {}) {
      return this._makeRequest({
        path: "/teams",
        versionPath: constants.VERSION_PATH.V2,
        ...args,
      });
    },
    getServices(args = {}) {
      return this._makeRequest({
        path: "/services",
        ...args,
      });
    },
    getIncidents(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/incidents/search",
        ...args,
      });
    },
    async *getIterations({
      resourceFn, resourceFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs?.params,
              offset,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

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

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("Last page reached");
          return;
        }

        offset += constants.DEFAULT_LIMIT;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
