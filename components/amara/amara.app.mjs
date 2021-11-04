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
      description: "Project slug for the video or null to put it in the default project",
      optional: true,
    },
    videoId: {
      type: "string",
      label: "Video ID",
      description: "Video ID as the Amara video identifier",
      async options({ prevContext }) {
        const { url } = prevContext ?? {};

        const {
          meta,
          objects: videos,
        } = await this.listVideos({
          url,
          params: {
            limit: 20,
            // order_by: constants.ORDER_BY.CREATED_DESC,
          },
        });

        const options = videos.map((video) => ({
          label: video.title,
          value: video.id,
        }));

        return {
          options,
          context: {
            url: meta.next,
          },
        };
      },
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limit the number of results",
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
        timeout: 10000,
      };

      return await axios($ ?? this, config);
    },
    async listVideos({
      $, url, params,
    }) {
      return await this._makeRequest({
        $,
        url,
        path: "/videos",
        params,
      });
    },
    async getVideo({
      $, videoId,
    }) {
      return await this._makeRequest({
        $,
        path: `/videos/${videoId}`,
      });
    },
    async deleteVideo({
      $, videoId,
    }) {
      return await this._makeRequest({
        $,
        method: "delete",
        path: `/videos/${videoId}`,
      });
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
    async getVideoSubtitleLanguages({
      $, url, videoId, params,
    }) {
      return await this._makeRequest({
        $,
        url,
        path: `/videos/${videoId}/languages`,
        params,
      });
    },
    async getSubtitleLanguage({
      $, videoId, language,
    }) {
      return await this._makeRequest({
        $,
        path: `/videos/${videoId}/languages/${language}`,
      });
    },
    async createSubtitleLanguage({
      $, videoId, data,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: `/videos/${videoId}/languages`,
        data,
      });
    },
    async updateSubtitleLanguage({
      $, videoId, language, data,
    }) {
      return await this._makeRequest({
        $,
        method: "put",
        path: `/videos/${videoId}/languages/${language}`,
        data,
      });
    },
    async getSubtitles({
      $, videoId, language, params,
    }) {
      return await this._makeRequest({
        $,
        path: `/videos/${videoId}/languages/${language}/subtitles`,
        params,
      });
    },
    async addSubtitles({
      $, videoId, language, data,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: `/videos/${videoId}/languages/${language}/subtitles`,
        data,
      });
    },
    async deleteSubtitles({
      $, videoId, language,
    }) {
      return await this._makeRequest({
        $,
        method: "delete",
        path: `/videos/${videoId}/languages/${language}/subtitles`,
      });
    },
    async listActions({
      $, videoId, language,
    }) {
      return await this._makeRequest({
        $,
        path: `/videos/${videoId}/languages/${language}/subtitles/actions`,
      });
    },
    async performAction({
      $, videoId, language, action,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: `/videos/${videoId}/languages/${language}/subtitles/actions`,
        data: {
          action,
        },
      });
    },
    async getTeam({
      $, teamId,
    }) {
      return await this._makeRequest({
        $,
        path: `/teams/${teamId}`,
      });
    },
    async getTeams({
      $, url, limit,
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
      $, url, team, limit,
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
