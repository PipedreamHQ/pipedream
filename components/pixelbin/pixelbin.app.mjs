import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "pixelbin",
  propDefinitions: {
    path: {
      type: "string",
      label: "Path",
      description: "Path where you want to store the asset. Path of containing folder. Eg. `folder1/folder2`.",
      optional: true,
      async options({
        page: pageNo, params, prevContext: { hasNext },
        mapper = ({
          name, path,
        }) => path
          ? `${path}/${name}`
          : name,
      }) {
        if (hasNext === false) {
          return [];
        }
        const {
          page,
          items,
        } = await this.listFiles({
          params: {
            onlyFolders: true,
            ...params,
            pageNo: pageNo + 1,
          },
        });
        return {
          options: items.map(mapper),
          context: {
            hasNext: page.hasNext,
          },
        };
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe.",
      optional: true,
    },
    access: {
      type: "string",
      label: "Access",
      description: "Access level of the asset.",
      options: [
        "public-read",
        "private",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the asset.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata for the asset.",
      optional: true,
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite",
      description: "Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.",
      optional: true,
    },
    filenameOverride: {
      type: "boolean",
      label: "Filename Override",
      description: "If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.",
      optional: true,
    },
  },
  methods: {
    getUrl(path, api = constants.API.ASSETS, version = constants.API.ASSETS.VERSION10) {
      const versionPath = version
        ? api.PATH.replace(constants.VERSION_PLACEHOLDER, version)
        : api.PATH;
      return `${constants.BASE_URL}${versionPath}${path}`;
    },
    getHeaders(headers) {
      const { api_token: apiToken } = this.$auth;
      const apiKey = Buffer.from(apiToken).toString("base64");
      return {
        "Content-Type": "application/json",
        ...headers,
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };
    },
    _makeRequest({
      $ = this, path, api, version, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, api, version),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        ...args,
        method: "DELETE",
      });
    },
    listFiles(args = {}) {
      return this._makeRequest({
        path: "/listFiles",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
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
              pageNo: page,
              pageSize: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && Date.parse(resource[dateField]) >= Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        if (response.page.hasNext === false) {
          console.log("hasNext is false");
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
