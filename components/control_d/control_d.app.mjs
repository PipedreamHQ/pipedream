import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "control_d",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Device name",
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "Primary key of main profile to enforce on this device",
      async options() {
        const { body: { profiles } } = await this.getProfiles();

        return profiles.map(({
          PK, name,
        }) => ({
          value: PK,
          label: name,
        }));
      },
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "ID of the device",
      async options() {
        const { body: { devices: devicesIds } } = await this.getDevices();

        return devicesIds.map(({
          PK, name,
        }) => ({
          value: PK,
          label: name,
        }));
      },
    },
    icon: {
      type: "string",
      label: "Icon",
      description: "Device icon/type",
      async options() {
        const { body: { types: iconsData } } = await this.getTypes();

        return [
          ...Object.keys(iconsData.os.icons).map((icon) => ({
            value: icon,
          })),
          ...Object.keys(iconsData.browser.icons).map((icon) => ({
            value: icon,
          })),
          ...Object.keys(iconsData.router.icons).map((icon) => ({
            value: icon,
          })),
        ];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.controld.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Accept": "application/json",
        },
      });
    },
    async createDevice(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/devices",
        ...args,
      });
    },
    async createProfile(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/profiles",
        ...args,
      });
    },
    async deleteDevice({
      device_id, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/devices/${device_id}`,
        ...args,
      });
    },
    async getDevices(args = {}) {
      return this._makeRequest({
        path: "/devices",
        ...args,
      });
    },
    async getProfiles(args = {}) {
      return this._makeRequest({
        path: "/profiles",
        ...args,
      });
    },
    async getTypes(args = {}) {
      return this._makeRequest({
        path: "/devices/types",
        ...args,
      });
    },
  },
};
