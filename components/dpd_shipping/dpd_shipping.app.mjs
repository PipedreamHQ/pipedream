import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dpd_shipping",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.environment === constants.ENVIRONMENT_TEST
        ? constants.TEST_BASE_URL
        : constants.BASE_URL;
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        ...args,
      });
    },
    async _getAuthToken({
      $, messageLanguage,
    }) {
      const { getAuthResponse } = await this._makeRequest({
        $,
        path: constants.LOGIN_SERVICE_PATH,
        data: {
          delisId: this.$auth.api_username,
          password: this.$auth.api_password,
          messageLanguage,
        },
      });
      return getAuthResponse?.return?.authToken;
    },
    async _authenticatedRequest({
      $,
      path,
      data,
      messageLanguage,
    }) {
      const language = messageLanguage || constants.DEFAULT_MESSAGE_LANGUAGE;
      const authToken = await this._getAuthToken({
        $,
        messageLanguage: language,
      });
      return this._makeRequest({
        $,
        path,
        data: {
          authentication: {
            delisId: this.$auth.api_username,
            authToken,
            messageLanguage: language,
          },
          ...data,
        },
      });
    },
    getTrackingData({
      $, messageLanguage, parcelLabelNumber,
    }) {
      return this._authenticatedRequest({
        $,
        messageLanguage,
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
