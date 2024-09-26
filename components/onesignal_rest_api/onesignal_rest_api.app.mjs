import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onesignal_rest_api",
  propDefinitions: {
    deviceId: {
      label: "Device",
      description: "ID of a device",
      type: "string",
      async options() {
        const devices = await this.getDevices();

        return devices.map((device) => ({
          label: device?.identifier ?? device.id,
          value: device.id,
        }));
      },
    },
  },
  methods: {
    _accessAppId() {
      return this.$auth.app_id;
    },
    _accessApiKey() {
      return this.$auth.rest_api_key;
    },
    _apiUrl() {
      return "https://onesignal.com/api/v1";
    },
    async _makeRequest(path, options = {}, $ = this) {
      const config = {
        ...options,
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Basic ${this._accessApiKey()}`,
        },
        data: {
          ...options.data,
          app_id: this._accessAppId(),
        },
      };

      return axios($, config);
    },
    async sendNotification({
      data, $,
    }) {
      return this._makeRequest("notifications", {
        method: "post",
        data,
      }, $);
    },
    async exportDevicesToCSV({
      data, $,
    }) {
      const response = await this._makeRequest("players/csv_export", {
        method: "post",
        data,
      }, $);

      return response?.csv_file_url;
    },
    async getDevices({ $ } = {}) {
      const response = await this._makeRequest("players", {}, $);

      return response?.players ?? [];
    },
    async getDevice({
      deviceId, $,
    } = {}) {
      const response = await this._makeRequest(`players/${deviceId}`, {}, $);

      return response;
    },
    async addDevice({
      data, $,
    }) {
      return this._makeRequest("players", {
        method: "post",
        data,
      }, $);
    },
  },
};
