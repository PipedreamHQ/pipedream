import { axios } from "@pipedream/platform";
import {
  COLOR_OPTIONS,
  ORIENTATION_OPTIONS,
  SIZE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "pexels",
  propDefinitions: {
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The search query. **Ocean**, **Tigers**, **Pears**, etc.",
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Desired photo orientation.",
      optional: true,
      options: ORIENTATION_OPTIONS,
    },
    size: {
      type: "string",
      label: "Size",
      description: "Minimum photo size.",
      optional: true,
      options: SIZE_OPTIONS,
    },
    color: {
      type: "string",
      label: "Color",
      description: "Desired photo color. You can set any color listed or any hexidecimal color code (eg. #ffffff)",
      optional: true,
      options: COLOR_OPTIONS,
    },
    photoId: {
      type: "string",
      label: "Photo ID",
      description: "The ID of the photo to retrieve or download.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pexels.com/v1";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    searchPhotos(opts = {}) {
      return this._makeRequest({
        path: "/search",
        ...opts,
      });
    },
    getPhoto({
      photoId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/photos/${photoId}`,
        ...opts,
      });
    },
    getCuratedPhotos(opts = {}) {
      return this._makeRequest({
        path: "/curated",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { photos } = await fn({
          params,
          ...opts,
        });
        for (const d of photos) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = photos.length;

      } while (hasMore);
    },
  },
};
