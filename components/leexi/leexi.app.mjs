import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "leexi",
  propDefinitions: {
    extension: {
      type: "string",
      label: "Recording File Extension",
      description: "The file extension of the recording.",
      options: constants.EXTENSION_OPTIONS,
    },
    callId: {
      type: "string",
      label: "Call ID",
      description: "The unique identifier of the call.",
      async options({ page }) {
        const { data } = await this.listCalls({
          params: {
            page,
            items: constants.DEFAULT_LIMIT,
          },
        });
        return data.map(({
          uuid: value, direction,
        }) => ({
          label: `${value} (${direction})`,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuth() {
      const {
        api_key_id: username,
        api_key_secret: password,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    _makeRequest({
      $ = this, url, path, ...args
    } = {}) {
      return axios($, {
        url: url ?? this.getUrl(path),
        ...(!url && {
          auth: this.getAuth(),
        }),
        ...args,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    listCalls(args = {}) {
      return this._makeRequest({
        debug: true,
        path: "/calls",
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
              items: constants.DEFAULT_LIMIT,
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
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
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
