import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "nordigen",
  propDefinitions: {
    countryCode: {
      type: "string",
      label: "Country",
      description: "Country where your bank is located.",
      options: constants.COUNTRY_CODE_OPTS,
    },
    institutionId: {
      type: "string",
      label: "Institution",
      description: "Select your institution",
      async options({ countryCode }) {
        const institutions = await this.listInstitutions(countryCode);
        return institutions.map((institution) => {
          return {
            label: institution.name,
            value: institution.id,
          };
        });
      },
    },
    accessValidForDays: {
      type: "integer",
      label: "Validity days",
      description: "Number of days the user agreement will be valid.",
    },
    maxHistoricalDays: {
      type: "integer",
      label: "Maximum historical days",
      description: "Number of days the user agreement will grant access to when listing transactions.",
    },
  },
  methods: {
    _getHost() {
      return "https://ob.nordigen.com/api/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._getHost()}${path}`,
        headers: this._getHeaders(),
        ...args,
      });
    },
    async listInstitutions(countryCode, args = {}) {
      return this._makeRequest({
        path: `/institutions/?country=${countryCode}`,
        ...args,
      });
    },
    async listTransactions(accountId, args = {}) {
      const response = await this._makeRequest({
        path: `/accounts/${accountId}/transactions/`,
        ...args,
      });
      return response.transactions.booked;
    },
    async createEndUserAgreement(args = {}) {
      return this._makeRequest({
        path: "/agreements/enduser/",
        method: "POST",
        ...args,
      });
    },
    async createRequisition(args = {}) {
      return this._makeRequest({
        path: "/requisitions/",
        method: "POST",
        ...args,
      });
    },
    async getRequisition(requisitionId, args = {}) {
      return this._makeRequest({
        path: `/requisitions/${requisitionId}`,
        ...args,
      });
    },
    async getAccountDetails(accountId, args = {}) {
      return this._makeRequest({
        path: `/accounts/${accountId}/details/`,
        ...args,
      });
    },
  },
};
