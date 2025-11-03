import { axios } from "@pipedream/platform";
import {
  PATH_PLATFORMS, PLATFORMS, URL_PLATFORMS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "scrapecreators",
  propDefinitions: {
    platform: {
      type: "string",
      label: "Platform",
      description: "The platform to search for creators on",
      options: PLATFORMS,
    },
    profileId: {
      type: "string",
      label: "Profile",
      description: "The handle, URL or unique ID of the creator profile",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scrapecreators.com/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
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
    searchCreators({
      platform, ...opts
    }) {
      return this._makeRequest({
        path: `/${platform}/search/users`,
        ...opts,
      });
    },
    fetchCreatorProfile({
      platform, profileId, ...opts
    }) {
      const params = this.parseParams(platform, profileId);
      const path = this.parsePath(platform);

      return this._makeRequest({
        path: `/${platform}${path}`,
        params,
        ...opts,
      });
    },
    parseParams(platform, profileId) {
      const params = {};
      const urlPlatforms = URL_PLATFORMS;

      if (urlPlatforms.includes(platform)) {
        params.url = profileId;
      } else {
        params.handle = profileId;
      }
      return params;
    },
    parsePath(platform) {
      const path = Object.entries(PATH_PLATFORMS).find(([
        key,
        value,
      ]) => value.includes(platform)
        ? key
        : null);

      return path
        ? path[0] === "empty"
          ? ""
          : `/${path[0]}`
        : "/profile";
    },
    async *paginate({
      fn, params = {}, platform, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let newCursor;

      do {
        params.cursor = newCursor;
        const {
          cursor,
          users,
        } = await fn({
          platform,
          params,
          ...opts,
        });
        for (const d of users) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        newCursor = cursor;
        hasMore = users.length;

      } while (hasMore);
    },
  },
};
