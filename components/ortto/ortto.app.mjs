import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ortto",
  propDefinitions: {
    orgCustomFieldId: {
      type: "string",
      label: "Organization Custom Field ID",
      description: "Organization custom field ID",
      async options() {
        const response = await this.listPeople();
        console.log("res", JSON.stringify(response, null, 2));
        return [];
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `https://${this.$auth.region}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "X-Api-Key": this.$auth.api_key,
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

      try {
        return await axios(step, config);
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
    listOrgCustomFields(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/organizations/custom-field/get",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/person/get",
        ...args,
      });
    },
    createActivity(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/activities/create",
        ...args,
      });
    },
    createCustomActivityDefinition(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/definitions/activity/create",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourcesName = "contacts",
      maxResources = constants.MAX_RESOURCES,
    }) {
      let offset;
      let resourcesCount = 0;

      while (true) {
        const {
          [resourcesName]: nextResources,
          next_offset: nextOffset,
          has_more: hasMore,
        } =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              offset,
            },
          });

        if (!nextResources?.length) {
          return;
        }

        if (nextOffset) {
          offset = nextOffset;
        }

        for (const resource of nextResources) {
          if (resourcesCount >= maxResources) {
            return;
          }

          yield resource;

          resourcesCount += 1;
        }

        if (!hasMore || (resourcesCount >= maxResources)) {
          return;
        }
      }
    },
  },
};
