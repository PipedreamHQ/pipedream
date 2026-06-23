import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dpd_shipping",
  propDefinitions: {},
  methods: {
    _baseUrl(useTestEnvironment) {
      return useTestEnvironment
        ? constants.TEST_BASE_URL
        : constants.BASE_URL;
    },
    _makeRequest({
      $ = this, path, useTestEnvironment, ...args
    }) {
      return axios($, {
        method: "POST",
        url: `${this._baseUrl(useTestEnvironment)}${path}`,
        ...args,
      });
    },
    // Exchange the connected account's credentials for a 24h authToken.
    // DPD requires this login before any data call.
    async _getAuthToken({
      $, messageLanguage, useTestEnvironment,
    }) {
      const { getAuthResponse } = await this._makeRequest({
        $,
        useTestEnvironment,
        path: constants.LOGIN_SERVICE_PATH,
        data: {
          delisId: this.$auth.api_username,
          password: this.$auth.api_password,
          messageLanguage,
        },
      });
      return getAuthResponse?.return?.authToken;
    },
    // Single entry point for every authenticated DPD call: mints a token, wraps
    // the operation payload in DPD's `authentication` envelope, and POSTs. New
    // actions add a thin wrapper that calls this with a path + data; they never
    // touch the token.
    async _authenticatedRequest({
      $,
      path,
      data,
      messageLanguage = constants.DEFAULT_MESSAGE_LANGUAGE,
      useTestEnvironment,
    }) {
      const authToken = await this._getAuthToken({
        $,
        messageLanguage,
        useTestEnvironment,
      });
      return this._makeRequest({
        $,
        useTestEnvironment,
        path,
        data: {
          authentication: {
            delisId: this.$auth.api_username,
            authToken,
            messageLanguage,
          },
          ...data,
        },
      });
    },
    getTrackingData({
      $, messageLanguage, parcelLabelNumber, useTestEnvironment,
    }) {
      return this._authenticatedRequest({
        $,
        messageLanguage,
        useTestEnvironment,
        path: constants.PARCEL_LIFECYCLE_SERVICE_PATH,
        data: {
          getTrackingData: {
            parcelLabelNumber,
          },
        },
      });
    },
  },
};
