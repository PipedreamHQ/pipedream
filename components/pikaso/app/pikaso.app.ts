import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import constants from "../actions/common/constants";

export default defineApp({
  type: "app",
  app: "pikaso",
  propDefinitions: {
    tweetId: {
      type: "string",
      label: "Tweet Id",
      description: "The id of the tweet to be saved, eg: `1526568680661786625`.\n\nAccepts the full url of the tweet, eg: `https://twitter.com/pipedream/status/1526568680661786625`",
    },
    layout: {
      type: "string",
      label: "Layout",
      description: "Layout of the generated image.",
      options: constants.LAYOUT_OPTS,
      optional: true,
    },
    theme: {
      type: "string",
      label: "Theme",
      description: "Theme of the generated image.",
      options: constants.THEME_OPTS,
      optional: true,
    },
    size: {
      type: "string",
      label: "Size",
      description: "Size of the generated image.",
      options: constants.SIZE_OPTS,
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://pikaso.me/api/v1";
    },
    _getAuth() {
      const {
        token,
        token_secret,
      } = this.$auth;
      const encodedToken = Buffer.from(`${token}:${token_secret}`).toString("base64");
      return `Basic ${encodedToken}`;
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": this._getAuth(),
      };
    },
    _getRequestParams(opts: any) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    filterEmptyValues(obj) {
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
    async screenshotTweet($ = this, params) {
      const linkInfo = await axios($, this._getRequestParams({
        method: "GET",
        path: "/tweet",
        params: this.filterEmptyValues(params),
        responseType: "arraybuffer",
      }));
      return linkInfo;
    },
  },
});
