import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "govee",
  propDefinitions: {
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "The device ID",
      async options() {
        const { data: devices } = await this.listDevices();
        return devices.map(({
          device: value,
          sku: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    commandType: {
      type: "string",
      label: "Command Type",
      description: "The type of command, e.g., power, brightness change, color change.",
      async options({ deviceId }) {
        const { data: devices } = await this.listDevices();
        const device = devices.find(({ device }) => device === deviceId);
        return device?.capabilities?.map(({
          type: value,
          instance: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Govee-API-Key": this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listDevices() {
      return this._makeRequest({
        path: "/user/devices",
      });
    },
  },
};
