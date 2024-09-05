import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "unsplash",
  propDefinitions: {
    photoId: {
      type: "string",
      label: "Photo ID",
      description: "The ID of the photo to retrieve.",
      async options({ page }) {
        const photos = await this.listPhotos({
          params: {
            page: page + 1,
            per_page: constants.DEFAULT_LIMIT,
          },
        });
        return photos.map(({
          id: value, slug: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Accept-Version": constants.API_VERSION,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    listPhotos(args = {}) {
      return this._makeRequest({
        path: "/photos",
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
              per_page: constants.DEFAULT_LIMIT,
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

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
