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
    getAuth({
      $, messageLanguage, useTestEnvironment,
    }) {
      return this._makeRequest({
        $,
        useTestEnvironment,
        path: constants.LOGIN_SERVICE_PATH,
        data: {
          delisId: this.$auth.api_username,
          password: this.$auth.api_password,
          messageLanguage,
        },
      });
    },
    getTrackingData({
      $, authToken, messageLanguage, parcelLabelNumber, useTestEnvironment,
    }) {
      return this._makeRequest({
        $,
        useTestEnvironment,
        path: constants.PARCEL_LIFECYCLE_SERVICE_PATH,
        data: {
          authentication: {
            delisId: this.$auth.api_username,
            authToken,
            messageLanguage,
          },
          getTrackingData: {
            parcelLabelNumber,
          },
        },
      });
    },
  },
};
