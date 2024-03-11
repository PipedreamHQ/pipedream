import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "supercast",
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listEpisodes(args = {}) {
      return this._makeRequest({
        path: "/episodes",
        ...args,
      });
    },
    listQuestions(args = {}) {
      return this._makeRequest({
        path: "/questions",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const nextResources =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
            },
          });

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

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
