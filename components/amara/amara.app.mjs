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

        if (url === null) {
          return [];
        }

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
    language: {
      type: "string",
      label: "Language",
      description: "Language code for the language of the subtitles",
      async options({
        videoId, prevContext,
      }) {
        const { url } = prevContext ?? {};

        if (url === null) {
          return [];
        }

        const {
          meta,
          objects: languages,
        } =
          await this.getVideoSubtitleLanguages({
            url,
            videoId,
            params: {
              limit: 20,
            },
          });

        const options = languages.map((language) => ({
          label: language.name,
          value: language.language_code,
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
    offset: {
      type: "integer",
      label: "Offset",
      description: "Start pagination after this number",
      optional: true,
    },
    isPrimaryAudioLanguage: {
      type: "boolean",
      label: "Is primary audio language",
      description: "Whether the language is the primary spoken language for the video",
      optional: true,
    },
    subtitlesComplete: {
      type: "boolean",
      label: "Subtitles complete",
      description: "Whether the subtitles are complete",
      optional: true,
    },
    softLimitLines: {
      type: "integer",
      label: "Soft limit lines",
      description: "Controls the max number of lines per subtitle. A warning is shown in the editor if this limit is exceeded.",
      optional: true,
    },
    softLimitMinDuration: {
      type: "integer",
      label: "Soft limit minimum duration",
      description: "Controls the minimum duration of subtitles in milliseconds. A warning is shown in the editor if this limit is exceeded.",
      optional: true,
    },
    softLimitMaxDuration: {
      type: "integer",
      label: "Soft limit maximum duration",
      description: "Controls the maximum duration of subtitles in milliseconds. This controls the message in the guidelines dialog.",
      optional: true,
    },
    softLimitCharactersPerLine: {
      type: "integer",
      label: "Soft limit characters per line",
      description: "Controls the maximum number of characters per line for subtitles. A warning is shown in the editor if this limit is exceeded.",
      optional: true,
    },
    softLimitCharactersPerSubtitles: {
      type: "integer",
      label: "Soft limit characters per subtitles",
      description: "Controls the maximum number of characters per subtitles. A warning is shown in the editor if this limit is exceeded.",
      optional: true,
    },
    subFormat: {
      type: "string",
      label: "Subtitles format",
      description: "The format to return the subtitles in. This can be any format that amara supports including `dfxp`, `srt`, `vtt`, and `sbv`. The default is `json`, which returns subtitle data encoded list of json dicts.",
      optional: true,
    },
    versionNumber: {
      type: "integer",
      label: "Version number",
      description: "Version number of the subtitles to fetch. Versions are listed in the VideoLanguageResouce request. If none is specified, the latest public version will be returned. If you want the latest private version (and have access to it) use “last”.",
      optional: true,
      async options({
        videoId, language,
      }) {

        const { versions } =
          await this.getSubtitleLanguage({
            videoId,
            language,
          });

        return versions.map(({ version_number: versionNumber }) => ({
          label: `Version ${versionNumber}`,
          value: versionNumber,
        }));
      },
    },
    subtitles: {
      type: "string",
      label: "Subtitles",
      description: "The subtitles to submit, as a string. The format depends on the `sub_format` param.",
      optional: true,
    },
    subtitlesUrl: {
      type: "string",
      label: "Subtitles URL",
      description: "Alternatively, subtitles can be given as a text file URL. The format depends on the `sub_format` param.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Give a title to the new revision.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Give a description to the new revision.",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "Name of the action to perform - optional, but recommended. For more details, see the [subtitle actions](https://apidocs.amara.org/#subtitle-actions-resource) documentation.",
      optional: true,
      async options({
        videoId, language,
      }) {
        const actions = await this.listActions({
          videoId,
          language,
        });

        return actions.map(({
          label, action,
        }) => ({
          label,
          value: action,
        }));
      },
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
      $, videoId, language, data,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: `/videos/${videoId}/languages/${language}/subtitles`,
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
      $, url, limit, offset,
    }) {
      return await this._makeRequest({
        $,
        url,
        path: "/teams",
        params: {
          limit,
          offset,
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
