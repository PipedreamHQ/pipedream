import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ringcentral",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Internal identifier of a RingCentral account or tilde (`~`) to indicate the account logged-in within the current session.",
      default: "~",
    },
    extensionId: {
      type: "string[]",
      label: "Extensions",
      description: "The extension (or user) that will trigger the event source",
      async options({ page }) {
        const { records: extensions } =
          await this._getExtensionList({
            params: {
              // Pages in the RingCentral API are 1-indexed
              page: page + 1,
              perPage: 10,
              status: "Enabled",
            },
          });
        return extensions.map((extension) => {
          const {
            id: value,
            extensionNumber,
            contact: {
              firstName,
              lastName,
            },
          } = extension;
          const label = `${firstName} ${lastName} (ext: ${extensionNumber})`;
          return {
            label,
            value,
          };
        });
      },
    },
    deviceId: {
      type: "string",
      label: "Device",
      description: "The extension's device that will trigger the event source",
      default: "",
      async options({
        page, extensionId,
      }) {
        const { records: devices } =
          await this._getDeviceList({
            extensionId,
            params: {
              // Pages in the RingCentral API are 1-indexed
              page: page + 1,
              perPage: 10,
            },
          });

        return devices.map((extension) => {
          const {
            id: value,
            type,
            name,
          } = extension;
          const label = `${name} (type: ${type})`;
          return {
            label,
            value,
          };
        });
      },
    },
    countryId: {
      type: "string",
      label: "Country ID",
      description: "Internal ID of a country.",
      optional: true,
      async options({ page }) {
        const { records: countries } =
          await this.getCountryList({
            params: {
              page: page + 1,
              perPage: 100,
            },
          });

        return countries.map(({
          id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      const platform = this.$auth.instancetype ?? "https://platform";
      return `${platform}.ringcentral.com/restapi/v1.0`;
    },
    getHeaders() {
      const authToken = this._authToken();
      return {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async makeRequest({
      $ = this, url, path, method = "get", ...args
    } = {}) {
      const config = {
        method,
        url: url ?? `${this._apiUrl()}${path}`,
        headers: this.getHeaders(),
        ...args,
      };
      try {
        return await axios($, config);
      } catch (error) {
        throw error.response?.data?.message ?? error;
      }
    },
    // https://developers.ringcentral.com/api-reference/Extensions/listExtensions
    async _getExtensionList(args = {}) {
      return this.makeRequest({
        path: "/account/~/extension",
        ...args,
      });
    },
    // https://developers.ringcentral.com/api-reference/Devices/listExtensionDevices
    async _getDeviceList({
      extensionId = "~", ...args
    }) {
      return this.makeRequest({
        path: `/account/~/extension/${extensionId}/device`,
        ...args,
      });
    },
    async getCountryList(args = {}) {
      return this.makeRequest({
        path: "/dictionary/country",
        ...args,
      });
    },
    // https://developers.ringcentral.com/api-reference/Call-Log/readUserCallLog
    async getUserCallLogRecords({
      accountId = "~", extensionId = "~", ...args
    }) {
      return this.makeRequest({
        path: `/account/${accountId}/extension/${extensionId}/call-log`,
        ...args,
      });
    },
    async makeCallOut({
      accountId = "~", ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/account/${accountId}/telephony/call-out`,
        ...args,
      });
    },
    async createMeeting({
      accountId = "~", extensionId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/account/${accountId}/extension/${extensionId}/meeting`,
        ...args,
      });
    },
    async sendSMS({
      accountId = "~", extensionId, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `/account/${accountId}/extension/${extensionId}/sms`,
        ...args,
      });
    },
    async getMessage({
      accountId = "~", extensionId, messageId, ...args
    }) {
      return this.makeRequest({
        path: `/account/${accountId}/extension/${extensionId}/message-store/${messageId}`,
        ...args,
      });
    },
    // Details about the different webhook parameters can be found in the
    // RingCentral API docs:
    // https://developers.ringcentral.com/api-reference/Subscriptions/createSubscription
    async createHook(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/subscription",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this.makeRequest({
        method: "delete",
        path: `/subscription/${hookId}`,
      });
    },
    async *getCallRecordings(extensionId, dateFrom, dateTo) {
      let url;

      do {
        const {
          records,
          navigation,
        } = await this.getUserCallLogRecords({
          url,
          extensionId,
          params: {
            dateFrom,
            dateTo,
            recordingType: "All", // undefined | "Automatic" | "OnDemand" | "All"
          },
        });

        for (const record of records) {
          yield record;
        }

        url = navigation.nextPage?.uri;
      } while (url);
    },
  },
};
