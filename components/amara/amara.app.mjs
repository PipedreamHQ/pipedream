import { axios } from "@pipedream/platform";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "amara",
  propDefinitions: {
    team:	{
      type: "string",
      label: "Team",
      description: "Team slug for the video or null to remove it from its team.",
      optional: true,
    },
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "The url for the video. Any url that Amara accepts will work here. You can send the URL for a file (e.g. `http:///www.example.com/my-video.ogv`), or a link to one of the accepted providers (YouTube, Vimeo).",
    },
    primaryAudioLanguageCode: {
      type: "string",
      label: "Primary audio language code",
      description: "Language code for the main language spoken in the video.",
      optional: true,
      async options() {
        const { languages } = await this.getLanguages();

        return Object.keys(languages)
          .map((key) => ({
            label: languages[key],
            value: key,
          }));
      },
    },
    project: {
      type: "string",
      label: "Project",
      description: "Project slug for the video or null to put it in the default project.",
      optional: true,
    },
  },
  methods: {
    async _makeRequest(opts) {
      const {
        $,
        url,
        path,
        params,
        ...otherOpts
      } = opts;

      const headers = {
        ...otherOpts.headers,
        [constants.X_API_KEY_HEADER]: this.$auth.api_key,
        [constants.CONTENT_TYPE_HEADER]: constants.JSON_CONTENT_TYPE,
      };

      const config = {
        ...otherOpts,
        headers,
        url: url ?? `${constants.BASE_URL}${constants.VERSION_PATH}${path}/`,
        params: url
          ? undefined
          : params,
      };

      return await axios($ ?? this, config);
    },
    async addVideo({
      $, data,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: "/videos",
        data,
      });
    },
    async getTeams({
      $, limit, url,
    }) {
      return await this._makeRequest({
        $,
        url,
        path: "/teams",
        params: {
          limit,
        },
      });
    },
    async getTeamProjects({
      $, team, limit, url,
    }) {
      return await this._makeRequest({
        $,
        url,
        path: `/teams/${team}/projects`,
        params: {
          limit,
        },
      });
    },
    async getLanguages({ $ } = {}) {
      return await this._makeRequest({
        $,
        path: "/languages",
      });
    },
    async getTeamNotifications({
      $, url, team, limit,
    }) {
      return await this._makeRequest({
        $,
        url,
        path: `/teams/${team}/notifications`,
        params: {
          limit,
        },
      });
    },
  },
};
