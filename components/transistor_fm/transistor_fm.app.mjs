import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "transistor_fm",
  propDefinitions: {
    showId: {
      type: "string",
      label: "Show ID",
      description: "The ID of the show you want to subscribe to.",
      async options({ page }) {
        const { data } = await this.getShows(page + 1);
        return data.map((show) => ({
          label: show.attributes.title,
          value: show.id,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.transistor.fm/v1";
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "x-api-key": this._getApiKey(),
      };
    },
    _generateFormDataFromObject(obj) {
      const formData = new FormData();
      for (const [
        key,
        value,
      ] of Object.entries(obj)) {
        if (value) {
          formData.append(key, value);
        }
      }
      return formData;
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: {
          ...this._getHeaders(),
          ...opts.headers,
        },
      };
      return res;
    },
    async getShows(page, ctx = this) {
      const formData = new FormData();
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/shows",
        data: formData,
        headers: {
          "content-type": "multipart/form-data",
        },
      }));
    },
    async createSubscriber(data, ctx = this) {
      const formData = this._generateFormDataFromObject(data);
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/subscribers",
        data: formData,
        headers: {
          ...formData.getHeaders(),
        },
      }));
    },
    async registerHook(data, ctx = this) {
      const formData = this._generateFormDataFromObject(data);
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/webhooks",
        data: formData,
        headers: {
          ...formData.getHeaders(),
        },
      }));
    },
    async unregisterHook(id, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "delete",
        path: `/webhooks/${id}`,
      }));
    },
  },
};
