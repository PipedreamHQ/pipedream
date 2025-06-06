import { TuyaContext } from "@tuya/tuya-connector-nodejs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "tuya",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of a user. E.g. `az1748632127862aWriL`",
    },
    homeId: {
      type: "string",
      label: "Home ID",
      description: "The identifier of a home",
      async options({ userId }) {
        const { result } = await this.listHomes({
          userId,
        });
        return result?.map(({
          home_id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "The identifier of a device",
      async options({
        userId, homeId,
      }) {
        const { result } = homeId
          ? await this.listHomeDevices({
            homeId,
          })
          : await this.listUserDevices({
            userId,
          });
        return result?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    instructionCode: {
      type: "string",
      label: "Instruction Code",
      description: "The code of the command to use. E.g. `switch_1`",
      async options({ deviceId }) {
        const { result } = await this.listDeviceFunctions({
          deviceId,
        });
        return result?.functions?.map(({
          code: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _getClient() {
      return new TuyaContext({
        baseUrl: this.$auth.base_url,
        accessKey: this.$auth.client_id,
        secretKey: this.$auth.client_secret,
      });
    },
    async _makeRequest({
      method = "GET",
      path,
      data = {},
    }) {
      const response = await this._getClient().request({
        method,
        path,
        body: data,
      });
      if (!response.success) {
        console.log(response);
        throw new ConfigurationError(`${response.msg}`);
      }
      return response;
    },
    listHomes({ userId }) {
      return this._makeRequest({
        path: `/v1.0/users/${userId}/homes`,
      });
    },
    listUserDevices({ userId }) {
      return this._makeRequest({
        path: `/v1.0/users/${userId}/devices`,
      });
    },
    listHomeDevices({ homeId }) {
      return this._makeRequest({
        path: `/v1.0/homes/${homeId}/devices`,
      });
    },
    listDeviceFunctions({ deviceId }) {
      return this._makeRequest({
        path: `/v1.0/devices/${deviceId}/functions`,
      });
    },
    sendInstructionsToDevice({
      deviceId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1.0/devices/${deviceId}/commands`,
        data,
      });
    },
  },
};
