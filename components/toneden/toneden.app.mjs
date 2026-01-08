import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "toneden",
  propDefinitions: {
    userId: {
      type: "integer",
      label: "User ID",
      description: "Numeric ID of the user whose ad campaigns will be retrieved.",
      async options() {
        const { user } = await this.getUserInfo();
        return [
          {
            label: user.username,
            value: user.id,
          },
        ];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(withAuth) {
      if (withAuth) {
        return {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        };
      }
    },
    _makeRequest({
      $ = this, path, withAuth = true, ...args
    } = {}) {
      const config = {
        ...args,
        debug: true,
        url: this.getUrl(path),
        headers: this.getHeaders(withAuth),
      };
      return axios($, config);
    },
    getUserInfo() {
      return this._makeRequest({
        path: "/users/me",
      });
    },
    getUserAdCampaigns({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}/advertising/campaigns`,
        ...args,
      });
    },
    getUserAttachments({
      userId, ...args
    }) {
      return this._makeRequest({
        withAuth: false,
        path: `/users/${userId}/attachments`,
        ...args,
      });
    },
    async *getIterations({
      resourceFn, resourceFnArgs, resourceName, max = constants.DEFAULT_MAX,
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
              limit: constants.DEFAULT_LIMIT,
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
            console.log("Max resources count reached");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("Ther is no more resources for pagination");
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
