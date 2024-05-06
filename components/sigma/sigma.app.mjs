import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "sigma",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name for the new item.",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "ID of the folder",
      async options({ page }) {
        const { entries } = await this.listFiles({
          params: {
            typeFilters: [
              "folder",
            ],
            limit: constants.DEFAULT_LIMIT,
            page,
          },
        });
        return entries.map(({
          id: value, path, name,
        }) => ({
          label: `${path}/${name}`,
          value,
        }));
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the item.",
      optional: true,
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the member.",
      optional: true,
      async options({ page }) {
        const { entries } = await this.listMembers({
          params: {
            limit: constants.DEFAULT_LIMIT,
            page,
          },
        });
        return entries.map(({
          memberId: value, firstName, lastName, email,
        }) => ({
          value,
          label: [
            firstName,
            lastName,
            email,
          ].filter(Boolean)
            .join(" "),
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.server}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listFiles(args = {}) {
      return this._makeRequest({
        path: "/files",
        ...args,
      });
    },
    listMembers(args = {}) {
      return this._makeRequest({
        path: "/members",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              limit: constants.DEFAULT_LIMIT,
              page,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (!response.hasMore) {
          console.log("No more resources to fetch");
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
