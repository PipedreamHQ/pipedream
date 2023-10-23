import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mux",
  propDefinitions: {
    assetId: {
      type: "string",
      label: "Asset",
      description: "Identifier of an asset",
      async options({ page }) {
        const { data } = await this.listAssets({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({ id }) => id) || [];
      },
    },
    playbackPolicy: {
      type: "string",
      label: "Playback Policy",
      description: "Playback policy assigned to the asset",
      options: constants.PLAYBACK_POLICY_OPTIONS,
      optional: true,
      default: "public",
    },
    mp4Support: {
      type: "string",
      label: "MP4 Support",
      description: "Level of support for mp4 playback",
      options: constants.MP4_SUPPORT_OPTIONS,
      optional: true,
    },
    masterAccess: {
      type: "string",
      label: "Master Access",
      description: "Level of support for master access",
      options: constants.MASTER_ACCESS_OPTIONS,
      optional: true,
    },
    assetType: {
      type: "string",
      label: "Type",
      description: "The type of track",
      options: constants.ASSET_TYPE_OPTIONS,
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the file that Mux should download and use.",
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language code value must be a valid [BCP 47](https://tools.ietf.org/html/bcp47) specification compliant value. For example, en for English or en-US for the US version of English. This parameter is required for text type and subtitles text type track.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the track containing a human-readable description. This value must be unique across all text type and subtitles text type tracks. The hls manifest will associate a subtitle text track with this value. For example, the value should be \"English\" for subtitles text track with language_code as en. This optional parameter should be used only for text type and subtitles text type tracks. If this parameter is not included, Mux will auto-populate based on the input[].language_code value.",
      optional: true,
    },
    closedCaptions: {
      type: "boolean",
      label: "Closed Captions",
      description: "Indicates the track provides Subtitles for the Deaf or Hard-of-hearing (SDH). This optional parameter should be used for text type and subtitles text type tracks.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mux.com/video/v1";
    },
    _auth() {
      return {
        username: `${this.$auth.access_key}`,
        password: `${this.$auth.secret_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...args,
      });
    },
    listAssets(args = {}) {
      return this._makeRequest({
        path: "/assets",
        ...args,
      });
    },
    listLiveStreams(args = {}) {
      return this._makeRequest({
        path: "/live-streams",
        ...args,
      });
    },
    createAsset(args = {}) {
      return this._makeRequest({
        path: "/assets",
        method: "POST",
        ...args,
      });
    },
    createAssetTrack({
      assetId, ...args
    }) {
      return this._makeRequest({
        path: `/assets/${assetId}/tracks`,
        method: "POST",
        ...args,
      });
    },
  },
};
