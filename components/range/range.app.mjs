import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "range",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to retrieve.",
      async options() {
        const { user } = await this.getAuthUser();
        const { users } = await this.listUsers({
          orgId: user.org_id,
        });
        return users.map((user) => ({
          label: user.profile.full_name,
          value: user.user_id,
        }));
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
    getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "X-Range-App-ID": this.$auth.oauth_client_id,
        "X-Range-Client": "pipedream/1",
        "Content-Type": "application/json",
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };
      return axios(step, config);
    },
    getAuthUser(args = {}) {
      return this.makeRequest({
        path: "/users/auth-user",
        ...args,
      });
    },
    listUsers({
      orgId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/orgs/${orgId}/users`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourcesFn,
      resourcesFnArgs,
      resourcesName,
    }) {

      while (true) {
        const {
          [resourcesName]: nextResources,
          pagination: { pagination_state: paginationState },
        } = await resourcesFn(resourcesFnArgs);

        if (!nextResources?.length) {
          console.log("No more resources");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
        }

        if (paginationState === constants.PAGINATION.STATE.END) {
          console.log("Pagination state is END");
          return;
        }
      }
    },
  },
};
