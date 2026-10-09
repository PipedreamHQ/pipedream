import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "heygen",
  propDefinitions: {
    customEvents: {
      type: "string[]",
      label: "Custom Events",
      description: "A custom set of event(s) that the user wants to trigger. Use the **List Custom Events Options** action to find available event types.",
      async options({ prevContext }) {
        const {
          data, has_more: hasMore, next_token: nextToken,
        } = await this.listEventTypes({
          params: {
            token: prevContext?.token,
          },
        });
        const options = data?.map(({ event_type: value }) => value) || [];
        if (!hasMore) {
          return options;
        }
        return {
          options,
          context: {
            token: nextToken,
          },
        };
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Identifier of a template. Use the **List Template ID Options** action to find available template IDs.",
    },
    avatarLookId: {
      type: "string",
      label: "Avatar Look ID",
      description: "Identifier of a photo avatar look. Use the **List Avatar Look ID Options** action to find available avatar look IDs.",
    },
    voiceId: {
      type: "string",
      label: "Voice ID",
      description: "Identifier of a voice. Use the **List Voice ID Options** action to find available voice IDs.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results per page (1-100). Defaults to the API default if not set.",
      min: 1,
      max: 100,
      optional: true,
    },
    avatarLookLimit: {
      type: "integer",
      label: "Limit",
      description: "Number of results per page (1-50). Defaults to the API default if not set.",
      min: 1,
      max: 50,
      optional: true,
    },
    token: {
      type: "string",
      label: "Token",
      description: "Cursor for the next page. Use the `next_token` value from a previous response.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the video",
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "Set the test flag to `true` to use test mode. Generation in test mode will not cost your credits and will contain a watermark on your video.",
    },
    caption: {
      type: "boolean",
      label: "Caption",
      description: "Set to `true` to create video with captions.",
    },
    videoId: {
      type: "string",
      label: "Video ID",
      description: "Identifier of a specific heygen video. Use the **List Videos** action to find video IDs.",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Only return videos in this folder. HeyGen has no API to list folders, so use a folder ID copied from the HeyGen app or returned in a video's `folder_id` field from a previous **List Videos** call.",
      optional: true,
    },
    videoFields: {
      type: "string[]",
      label: "Fields",
      description: "Only return these fields for each video, to keep the response small. Valid fields: `id`, `status`, `title`, `created_at`, `completed_at`, `video_url`, `thumbnail_url`, `gif_url`, `captioned_video_url`, `subtitle_url`, `duration`, `folder_id`, `output_language`, `failure_code`, `failure_message`, `video_page_url`. Example: `[\"id\", \"title\", \"status\"]`. Returns all fields if not set.",
      optional: true,
    },
    avatarLookFields: {
      type: "string[]",
      label: "Fields",
      description: "Only return these fields for each avatar look, to keep the response small. Valid fields include `id`, `name`, `avatar_type`, `group_id`, `preview_image_url`, `preview_video_url`, `gender`, `tags`, `default_voice_id`, `status`. Example: `[\"id\", \"name\"]`. Returns all fields if not set.",
      optional: true,
    },
    titleFilter: {
      type: "string",
      label: "Title",
      description: "Only return videos whose title contains this text",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    _headers(headers) {
      return {
        ...headers,
        "X-Api-Key": `${this.$auth.api_token}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        url: this._getUrl(path),
        headers: this._headers(headers),
        ...otherOpts,
      });
    },
    pluckFields(items = [], fields) {
      if (!fields?.length) {
        return items;
      }
      return items.map((item) => Object.fromEntries(fields.map((field) => [
        field,
        item[field],
      ])));
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/endpoints",
        ...args,
      });
    },
    deleteWebhook({
      endpointId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/endpoints/${endpointId}`,
        ...args,
      });
    },
    getVideo({
      videoId, ...args
    }) {
      return this._makeRequest({
        path: `/videos/${videoId}`,
        ...args,
      });
    },
    listEventTypes(args = {}) {
      return this._makeRequest({
        path: "/webhooks/event-types",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    listAvatarLooks(args = {}) {
      return this._makeRequest({
        path: "/avatars/looks",
        ...args,
      });
    },
    listVideos(args = {}) {
      return this._makeRequest({
        path: "/videos",
        ...args,
      });
    },
    listVoices(args = {}) {
      return this._makeRequest({
        path: "/voices",
        ...args,
      });
    },
  },
};
