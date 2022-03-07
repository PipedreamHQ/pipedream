import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ultramsg",
  propDefinitions: {
    to: {
      type: "string",
      label: "To",
      description: "Phone with international format e.g. `+1408XXXXXXX` , or chatID for contact or group",
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://api.ultramsg.com/${this.$auth.instance_id}`;
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        data: this._getAxiosConvertedData(opts.data),
      };
    },
    _getAxiosConvertedData(data) {
      return new URLSearchParams({
        token: this.$auth.token,
        ...data,
      });
    },
    _getHeaders() {
      return {
        "content-type": "application/x-www-form-urlencoded",
      };
    },
    async sendMessage(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/chat",
        data,
      }));
    },
    async sendImage(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/image",
        data,
      }));
    },
    async sendDocument(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/document",
        data,
      }));
    },
    async sendAudio(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/audio",
        data,
      }));
    },
    async sendVideo(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/video",
        data,
      }));
    },
    async sendLink(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/link",
        data,
      }));
    },
    async sendLocation(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/messages/location",
        data,
      }));
    },
  },
};
