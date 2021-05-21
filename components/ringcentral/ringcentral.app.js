const axios = require("axios");

module.exports = {
  type: "app",
  app: "ringcentral",
  propDefinitions: {
    extensionId: {
      type: "string",
      label: "Extension",
      description: "The extension (or user) that will trigger the event source",
      async options(context) {
        const { page } = context;

        const { records: extensions } = await this._getExtensionList({
          // Pages in the RingCentral API are 1-indexed
          page: page + 1,
          perPage: 10,
          status: "Enabled",
        });
        const options = extensions.map((extension) => {
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

        return {
          options,
          context: {
            nextPage: page + 1,
          },
        };
      },
    },
    deviceId: {
      type: "string",
      label: "Device",
      description: "The extension's device that will trigger the event source",
      default: "",
      async options(context) {
        const {
          page,
          extensionId,
        } = context;

        const { records: devices } = await this._getDeviceList(extensionId, {
          // Pages in the RingCentral API are 1-indexed
          page: page + 1,
          perPage: 10,
        });
        const options = devices.map((extension) => {
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

        return {
          options,
          context: {
            nextPage: page + 1,
            extensionId,
          },
        };
      },
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      const {
        base_url: baseUrl = "https://platform.ringcentral.com/restapi/v1.0",
      } = this.$auth;
      return baseUrl;
    },
    _accountUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/account/~`;
    },
    _extensionUrl() {
      const baseUrl = this._accountUrl();
      return `${baseUrl}/extension`;
    },
    _deviceUrl(extensionId = "~") {
      const baseUrl = this._extensionUrl();
      return `${baseUrl}/${extensionId}/device`;
    },
    _callLogUrl(extensionId = "~") {
      const baseUrl = this._extensionUrl();
      return `${baseUrl}/${extensionId}/call-log`;
    },
    _subscriptionUrl(id) {
      const baseUrl = this._apiUrl();
      const basePath = "/subscription";
      const path = id ? `${basePath}/${id}` : basePath;
      return `${baseUrl}${path}`;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async _getExtensionList(params) {
      // `params` refers to the query params listed in the API docs:
      // https://developers.ringcentral.com/api-reference/Extensions/listExtensions
      const url = this._extensionUrl();
      const requestConfig = {
        ...this._makeRequestConfig(),
        params,
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
    async _getDeviceList(extensionId, params) {
      // `params` refers to the query params listed in the API docs:
      // https://developers.ringcentral.com/api-reference/Devices/listExtensionDevices
      const url = this._deviceUrl(extensionId);
      const requestConfig = {
        ...this._makeRequestConfig(),
        params,
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
    async _getExtensionCallLog(extensionId, params, nextPage = {}) {
      // `params` refers to the query params listed in the API docs:
      // https://developers.ringcentral.com/api-reference/Call-Log/readUserCallLog
      const {
        uri: url = this._callLogUrl(extensionId),
      } = nextPage;
      const requestConfig = {
        ...this._makeRequestConfig(),
        params,
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
    async *getCallRecordings(extensionId, dateFrom, dateTo) {
      const params = {
        dateFrom,
        dateTo,
        withRecording: true,
      };

      let nextPage = {};
      do {
        const {
          records,
          navigation,
        } = await this._getExtensionCallLog(extensionId, params, nextPage);

        for (const record of records) {
          yield record;
        }

        nextPage = navigation.nextPage;
      } while (nextPage);
    },
    async createHook({
      address,
      eventFilters,
      verificationToken,
    }) {
      const url = this._subscriptionUrl();
      const requestConfig = this._makeRequestConfig();

      // Details about the different webhook parameters can be found in the
      // RingCentral API docs:
      // https://developers.ringcentral.com/api-reference/Subscriptions/createSubscription
      const requestData = {
        eventFilters,
        deliveryMode: {
          transportType: "WebHook",
          address,
          verificationToken,
          expiresIn: 630720000, // 20 years (max. allowed by the API)
        },
      };

      const { data } = await axios.post(url, requestData, requestConfig);
      return {
        ...data,
        verificationToken,
      };
    },
    deleteHook(hookId) {
      const url = this._subscriptionUrl(hookId);
      const requestConfig = this._makeRequestConfig();
      return axios.delete(url, requestConfig);
    },
  },
};
