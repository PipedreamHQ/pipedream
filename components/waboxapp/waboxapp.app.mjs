import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "waboxapp",
  propDefinitions: {
    uid: {
      type: "string",
      label: "UID",
      description: "Your account phone number with international code. E.g. 34666123456",
    },
    to: {
      type: "string",
      label: "To",
      description: "Recipient's phone number with international code. E.g. 34666789123",
    },
    customUid: {
      type: "string",
      label: "Custom UID",
      description: "Your custom unique ID for the new message to be send. **Must be unique**. Will be sent back to you on ACK events",
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the content to send",
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "Title to show on the preview",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Extended description to show on the preview",
      optional: true,
    },
    urlThumb: {
      type: "string",
      label: "Thumbnail URL",
      description: "URL of the thumbnail image to show on the preview",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.waboxapp.com/api";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          token: this.$auth.api_token,
        },
        ...otherOpts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send/chat",
        ...opts,
      });
    },
    sendImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send/image",
        ...opts,
      });
    },
    sendLink(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send/link",
        ...opts,
      });
    },
    sendMedia(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send/media",
        ...opts,
      });
    },
  },
};
