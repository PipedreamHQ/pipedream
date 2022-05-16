import { axios } from "@pipedream/platform";

export default {
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
      const platform = this.$auth.instancetype ?? "https://platform";
      return `${platform}.ringcentral.com/restapi/v1.0`;
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
      const path = id && `${basePath}/${id}` || basePath;
      return `${baseUrl}${path}`;
    },
    getHeaders() {
      const authToken = this._authToken();
      return {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async _getExtensionList(params) {
      // `params` refers to the query params listed in the API docs:
      // https://developers.ringcentral.com/api-reference/Extensions/listExtensions
      return axios(this, {
        url: this._extensionUrl(),
        headers: this.getHeaders(),
        params,
      });
    },
    async _getDeviceList(extensionId, params) {
      // `params` refers to the query params listed in the API docs:
      // https://developers.ringcentral.com/api-reference/Devices/listExtensionDevices
      return axios(this, {
        url: this._deviceUrl(extensionId),
        headers: this.getHeaders(),
        params,
      });
    },
    async _getExtensionCallLog(extensionId, params, nextPage = {}) {
      // `params` refers to the query params listed in the API docs:
      // https://developers.ringcentral.com/api-reference/Call-Log/readUserCallLog
      const { uri: url = this._callLogUrl(extensionId) } = nextPage;
      return axios(this, {
        url,
        headers: this.getHeaders(),
        params,
      });
    },
    async makeCallOut({
      accountId = "~", ...args
    } = {}) {
      return axios(this, {
        method: "post",
        url: `${this._apiUrl()}/account/${accountId}/telephony/call-out`,
        headers: this.getHeaders(),
        ...args,
      });
    },
    async createMeeting({
      accountId = "~", extensionId, ...args
    } = {}) {
      return axios(this, {
        method: "post",
        url: `${this._apiUrl()}/account/${accountId}/extension/${extensionId}/meeting`,
        headers: this.getHeaders(),
        ...args,
      });
    },
    async sendSMS({
      accountId = "~", extensionId, ...args
    }) {
      return axios(this, {
        method: "post",
        url: `${this._apiUrl()}/account/${accountId}/extension/${extensionId}/sms`,
        headers: this.getHeaders(),
        ...args,
      });
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
      // Details about the different webhook parameters can be found in the
      // RingCentral API docs:
      // https://developers.ringcentral.com/api-reference/Subscriptions/createSubscription
      const data = await axios(this, {
        method: "post",
        url: this._subscriptionUrl(),
        headers: this.getHeaders(),
        data: {
          eventFilters,
          deliveryMode: {
            transportType: "WebHook",
            address,
            verificationToken,
            expiresIn: 630720000, // 20 years (max. allowed by the API)
          },
        },
      });
      return {
        ...data,
        verificationToken,
      };
    },
    deleteHook(hookId) {
      return axios(this, {
        method: "delete",
        url: this._subscriptionUrl(hookId),
        headers: this.getHeaders(),
      });
    },
  },
};
