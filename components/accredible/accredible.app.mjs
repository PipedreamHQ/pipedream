import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "accredible",
  propDefinitions: {
    credentialId: {
      type: "string",
      label: "Credential ID",
      description: "The ID of the existing credential",
      async options({ page }) {
        const { credentials } = await this.searchCredentials({
          data: {
            query: {
              "created_at[gte]": utils.getDateFormatted(undefined, 1),
            },
            page: {
              from: page * constants.DEFAULT_LIMIT,
              size: constants.DEFAULT_LIMIT,
            },
          },
        });
        return credentials.map(({
          id: value, recipient_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options({ page }) {
        const { groups } = await this.searchGroups({
          params: {
            page: page + 1,
          },
        });
        return groups.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "The email of the recipient",
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "The name of the recipient",
    },
    credentialData: {
      type: "object",
      label: "Credential Data",
      description: "The data of the credential",
      optional: true,
    },
  },
  methods: {
    getUrl(path, apiVersion = constants.API.V1) {
      return `${constants.BASE_URL}${apiVersion}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Token token=${this.$auth.api_key}`,
        ...headers,
      };
    },
    makeRequest({
      $ = this, path, headers, apiVersion, ...args
    } = {}) {
      return axios($, {
        url: this.getUrl(path, apiVersion),
        headers: this.getHeaders(headers),
        ...args,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    getCredential({
      credentialId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/credentials/${credentialId}`,
        ...args,
      });
    },
    createCredential(args = {}) {
      return this.post({
        path: "/credentials",
        ...args,
      });
    },
    updateCredential({
      credentialId, ...args
    } = {}) {
      return this.put({
        path: `/credentials/${credentialId}`,
        ...args,
      });
    },
    deleteCredential({
      credentialId, ...args
    } = {}) {
      return this.delete({
        path: `/credentials/${credentialId}`,
        ...args,
      });
    },
    searchGroups(args = {}) {
      return this.post({
        path: "/issuer/groups/search",
        ...args,
      });
    },
    searchCredentials(args = {}) {
      return this.post({
        path: "/credentials/search",
        apiVersion: constants.API.V2,
        ...args,
      });
    },
    async *getIterations({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let from = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            data: {
              ...resourceFnArgs?.data,
              page: {
                size: constants.DEFAULT_LIMIT,
                from,
              },
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
          console.log("Less resources than limit found");
          return;
        }

        from += constants.DEFAULT_LIMIT;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
