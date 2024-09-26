import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "pushbullet",
  propDefinitions: {
    device: {
      label: "Device",
      description: "Select a device",
      type: "string",
      async options() {
        const devices = await this.getDevices();

        return devices.map((device) => ({
          label: device.nickname,
          value: device.iden,
        }));
      },
    },
    push: {
      label: "Sended Push",
      description: "Select a push",
      type: "string",
      async options() {
        const pushes = await this.getPushes();

        return pushes.map((push) => ({
          label: push.title ?? push.iden,
          value: push.iden,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.pushbullet.com/v2";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        ...options,
        url: `${this._apiUrl()}/${path}`,
        headers: {
          ...options?.headers,
          "Access-Token": this._accessToken(),
        },
      });
    },
    async downloadFile({
      fileUrl, $,
    }) {
      const response = await axios($ ?? this, {
        url: fileUrl,
        responseType: "arraybuffer",
      });

      return Buffer.from(response.toString("base64"), "base64");
    },
    async getUploadUrl({
      data, $,
    }) {
      return this._makeRequest("upload-request", {
        method: "post",
        data,
      }, $);
    },
    async uploadFile({
      uploadUrl, fileBuffer, $,
    }) {
      const data = new FormData();
      data.append("file", fileBuffer);

      return axios($ ?? this, {
        url: uploadUrl,
        method: "post",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
        data,
      });
    },
    async getDevices({ $ } = {}) {
      const response = await this._makeRequest("devices", {}, $);

      return response.devices;
    },
    async sendPush({
      data, $,
    }) {
      return this._makeRequest("pushes", {
        method: "post",
        data,
      }, $);
    },
    async getPushes({ $ } = {}) {
      let cursor;

      let pushes = [];

      do {
        const response = await this._makeRequest("pushes", {
          params: {
            cursor,
          },
        }, $);

        pushes = pushes.concat(response.pushes);

        cursor = response?.cursor;
      } while (cursor);

      return pushes;
    },
    async deletePush({
      pushIden, $,
    } = {}) {
      return this._makeRequest(`pushes/${pushIden}`, {
        method: "delete",
      }, $);
    },
  },
};
