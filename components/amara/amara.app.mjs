import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "amara",
  propDefinitions: {
    team:	{
      type: "string",
      label: "Team",
      description: "Filter by team (e.g. `amplify` in `https://amara.org/en/teams/amplify/`). Leave blank for videos that are in the public area.",
      optional: true,
    },
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "The URL for the video. Any URL that Amara accepts will work here. You can send the URL for a file (e.g. `http:///www.example.com/my-video.ogv`), or a link to one of the accepted providers (YouTube, Vimeo).",
    },
    primaryAudioLanguageCode: {
      type: "string",
      label: "Primary audio language code",
      description: "Language code for the main language spoken in the video ([ISO 639-1 two-letter code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes))",
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
      async options({
        prevContext, team,
      }) {
        const { url } = prevContext;

        if (url === null || !team) {
          return [];
        }

        let meta, projects;
        try {
          ({
            meta,
            objects: projects,
          } = await this.getTeamProjects({
            team,
          }));

        } catch (error) {
          return [];
        }

        const options = projects.map((project) => ({
          label: project.name,
          value: project.slug,
        }));

        return {
          options,
          context: {
            url: meta.next,
          },
        };
      },
    },
    videoId: {
      type: "string",
      label: "Video ID",
      description: "Video ID as the Amara video identifier",
      async options({
        prevContext, team,
      }) {
        const { url } = prevContext;

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
            team: team || null,
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
      description: "Language code for the language of the subtitles ([ISO 639-1 two-letter code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes))",
      async options({
        videoId, prevContext,
      }) {
        const { url } = prevContext;

        if (url === null) {
          return [];
        }

        let meta, languages;
        try {
          ({
            meta,
            objects: languages,
          } =
            await this.getVideoSubtitleLanguages({
              url,
              videoId,
              params: {
                limit: 20,
              },
            }));
        } catch (error) {
          return [];
        }

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
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Start pagination after this number",
      optional: true,
      min: 0,
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
      options({ notAllowedFormats = [] }) {
        return Object.keys(constants.FORMAT_TYPES)
          .filter((key) => !notAllowedFormats.includes(constants.FORMAT_TYPES[key]))
          .map((key) => ({
            label: key,
            value: constants.FORMAT_TYPES[key],
          }));
      },
    },
    versionNumber: {
      type: "integer",
      label: "Version number",
      description: "Version number of the subtitles to fetch. Versions are listed in the [VideoLanguageResouce](https://apidocs.amara.org/#list-subtitle-languages-for-a-video) request. If none is specified, the latest public version will be returned. If you want the latest private version (and have access to it) use “last”.",
      optional: true,
      async options({
        videoId, language,
      }) {
        try {
          const { versions } =
            await this.getSubtitleLanguage({
              videoId,
              language,
            });

          return versions.map(({ version_number: versionNumber }) => ({
            label: `Version ${versionNumber}`,
            value: versionNumber,
          }));

        } catch (error) {
          return [];
        }
      },
    },
    subtitles: {
      type: "string",
      label: "Subtitles",
      description: "The subtitles to submit, as a string, depending on **Subtitles format**. Enter an [expression](https://pipedream.com/docs/workflows/steps/params/#entering-expressions) to preserve escape sequences (e.g. `{{\"WEBVTT\\n\\n00:01.000 --> 00:04.000\\nNever drink liquid nitrogen.\\n\\n00:05.000 --> 00:09.000\\n- It will perforate your stomach.\\n- You could die.\"}}`).",
      optional: true,
    },
    subtitlesUrl: {
      type: "string",
      label: "Subtitles URL",
      description: "Alternatively, subtitles can be given as a text file URL. The format depends on **Subtitles format**.",
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
        try {
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

        } catch (error) {
          return [];
        }

      },
    },
    max: {
      type: "integer",
      label: "Max records",
      description: "Max number of records in the whole pagination",
      optional: false,
      default: constants.DEFAULT_MAX_ITEMS,
      min: 1,
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
      return this._makeRequest({
        $,
        url,
        path: "/videos",
        params,
      });
    },
    async getVideo({
      $, videoId,
    }) {
      return this._makeRequest({
        $,
        path: `/videos/${videoId}`,
      });
    },
    async deleteVideo({
      $, videoId,
    }) {
      return this._makeRequest({
        $,
        method: "delete",
        path: `/videos/${videoId}`,
      });
    },
    async addVideo({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "post",
        path: "/videos",
        data,
      });
    },
    async getVideoSubtitleLanguages({
      $, url, videoId, params,
    }) {
      return this._makeRequest({
        $,
        url,
        path: `/videos/${videoId}/languages`,
        params,
      });
    },
    async createSubtitleLanguage({
      $, videoId, data,
    }) {
      return this._makeRequest({
        $,
        method: "post",
        path: `/videos/${videoId}/languages`,
        data,
      });
    },
    async getSubtitleLanguage({
      $, videoId, language,
    }) {
      return this._makeRequest({
        $,
        path: `/videos/${videoId}/languages/${language}`,
      });
    },
    async addNewSubtitles({
      $, videoId, language, data,
    }) {
      return this._makeRequest({
        $,
        method: "post",
        path: `/videos/${videoId}/languages/${language}/subtitles`,
        data,
      });
    },
    async updateSubtitleLanguage({
      $, videoId, language, data,
    }) {
      return this._makeRequest({
        $,
        method: "put",
        path: `/videos/${videoId}/languages/${language}`,
        data,
      });
    },
    async getSubtitles({
      $, videoId, language, params,
    }) {
      return this._makeRequest({
        $,
        path: `/videos/${videoId}/languages/${language}/subtitles`,
        params,
      });
    },
    async getRawSubtitles({
      $, videoId, language, format,
    }) {
      return this._makeRequest({
        $,
        path: `/videos/${videoId}/languages/${language}/subtitles`,
        params: {
          format,
        },
      });
    },
    async deleteSubtitles({
      $, videoId, language,
    }) {
      return this._makeRequest({
        $,
        method: "delete",
        path: `/videos/${videoId}/languages/${language}/subtitles`,
      });
    },
    async listActions({
      $, videoId, language,
    }) {
      return this._makeRequest({
        $,
        path: `/videos/${videoId}/languages/${language}/subtitles/actions`,
      });
    },
    async performAction({
      $, videoId, language, action,
    }) {
      return this._makeRequest({
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
      return this._makeRequest({
        $,
        path: `/teams/${teamId}`,
      });
    },
    async getTeams({
      $, url, params,
    }) {
      return this._makeRequest({
        $,
        url,
        path: "/teams",
        params,
      });
    },
    async getTeamProjects({
      $, url, team, limit,
    }) {
      return this._makeRequest({
        $,
        url,
        path: `/teams/${team}/projects`,
        params: {
          limit,
        },
      });
    },
    async getLanguages({ $ } = {}) {
      return this._makeRequest({
        $,
        path: "/languages",
      });
    },
    async getTeamNotifications({
      $, url, team, params,
    }) {
      return this._makeRequest({
        $,
        url,
        path: `/teams/${team}/notifications`,
        params,
      });
    },
    async getTeamActivity({
      $, url, team, params,
    }) {
      return this._makeRequest({
        $,
        url,
        path: `/teams/${team}/activity`,
        params,
      });
    },
    /**
     * getResourcesStream always gets the latest resources from the API.
     * @param {Object} args - all arguments to pass to the `getResourcesStream` function
     * @param {Function} args.resouceFn - the name of the resource function to call
     * @param {Object} args.resourceFnArgs - the arguments object to pass to the resource function
     * @param {number} [args.offset] - the offset to start at
     * @param {number} [args.limit=100] - the number of resources to get per page
     * @param {number} [args.max] - the maximum number of resources to get
     * @param {string} [args.lastResourceStr] - the last resource string in cache
     * to validate against. This parameter is only passed in from sources.
     * @returns {Iterable} - Iterable that yields resources,
     *  the first element is the last resource string in cache
     */
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      offset,
      limit = constants.DEFAULT_PAGE_LIMIT,
      max,
      lastResourceStr,
    }) {
      let lastUrl;
      let resourcesCount = 0;

      while (true) {
        const nextResponse = await resourceFn({
          ...resourceFnArgs,
          url: lastUrl,
          params: {
            ...resourceFnArgs.params,
            limit,
            offset,
          },
        });

        if (!nextResponse) {
          throw new Error("No response from the Amara API.");
        }

        let nextResources = nextResponse.objects;

        if (nextResponse.meta.next) {
          lastUrl = nextResponse.meta.next;
        }

        for (const resource of nextResources) {
          if (lastResourceStr && JSON.stringify(resource) === lastResourceStr) {
            return;
          }

          yield resource;

          resourcesCount += 1;
        }

        if (!nextResponse?.meta.next || (max && resourcesCount >= max)) {
          return;
        }
      }
    },
  },
};
