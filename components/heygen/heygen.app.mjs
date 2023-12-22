import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "heygen",
  propDefinitions: {
    customEvents: {
      type: "string[]",
      label: "Custom Events",
      description: "A custom set of event(s) that the user wants to trigger",
      async options() {
        const { data } = await this.listEventTypes();
        return data;
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Identifier of a template",
      async options() {
        const { data } = await this.listTemplates();
        return data.templates?.map(({
          template_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    talkingPhotoId: {
      type: "string",
      label: "Talking Photo ID",
      description: "Identifier of a talking-photo",
      async options() {
        const { data } = await this.listTalkingPhotos();
        return data?.map(({ id }) => id) || [];
      },
    },
    voiceId: {
      type: "string",
      label: "Voice ID",
      description: "Identifier of a voice",
      async options() {
        const { data } = await this.listVoices();
        return data.voices?.map(({
          voice_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
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
      description: "Identifier of a specific heygen video",
    },
  },
  methods: {
    _getUrl(path, version = constants.VERSION_2_PATH) {
      return `${constants.BASE_URL}${version}${path}`;
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
        version,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        url: this._getUrl(path, version),
        headers: this._headers(headers),
        ...otherOpts,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/endpoint.add",
        version: constants.VERSION_1_PATH,
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhook/endpoint.delete",
        version: constants.VERSION_1_PATH,
        ...args,
      });
    },
    getTemplate({
      templateId, ...args
    }) {
      return this._makeRequest({
        path: `/template/${templateId}`,
        ...args,
      });
    },
    getVideo(args = {}) {
      return this._makeRequest({
        path: "/video_status.get",
        version: constants.VERSION_1_PATH,
        ...args,
      });
    },
    listEventTypes(args = {}) {
      return this._makeRequest({
        path: "/webhook/webhook.list",
        version: constants.VERSION_1_PATH,
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    listTalkingPhotos(args = {}) {
      return this._makeRequest({
        path: "/talking_photo.list",
        version: constants.VERSION_1_PATH,
        ...args,
      });
    },
    listVoices(args = {}) {
      return this._makeRequest({
        path: "/voices",
        ...args,
      });
    },
    createTalkingPhoto(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/video/generate",
        ...args,
      });
    },
    generateVideoFromTemplate({
      templateId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/template/${templateId}/generate`,
        ...args,
      });
    },
  },
};
