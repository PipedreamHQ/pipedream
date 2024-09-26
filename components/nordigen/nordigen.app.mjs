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
    requisitionId: {
      type: "string",
      label: "Requisition Id",
      description: "Select the requisitionId to use for this request",
      async options({ page }) {
        const limit = 20;
        const params = {
          limit,
          offset: page * limit,
        };
        const { results } = await this.listRequisitions({
          params,
        });
        return results.map((result) => result.id);
      },
    },
    accountId: {
      type: "string",
      label: "AccountId",
      description: "The account to retrieve information for",
      async options({ requisitionId }) {
        const { accounts } = await this.getRequisition(requisitionId);
        return accounts;
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
    accessScope: {
      type: "string[]",
      label: "Access Scope",
      description: "Select an access scope",
      options: [
        "balances",
        "details",
        "transactions",
      ],
    },
  },
  methods: {
    _getHost() {
      return "https://bankaccountdata.gocardless.com/api/v2";
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
    async listRequisitions(args = {}) {
      return this._makeRequest({
        path: "/requisitions/",
        ...args,
      });
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
    async getAccountMetadata(accountId, args = {}) {
      return this._makeRequest({
        path: `/accounts/${accountId}/`,
        ...args,
      });
    },
    async getAccountBalances(accountId, args = {}) {
      return this._makeRequest({
        path: `/accounts/${accountId}/balances`,
        ...args,
      });
    },
    async createRequisitionLink({
      institutionId,
      maxHistoricalDays,
      accessValidForDays,
      accessScope,
    }) {
      const agreement = await this.createEndUserAgreement({
        data: {
          institution_id: institutionId,
          max_historical_days: maxHistoricalDays,
          access_valid_for_days: accessValidForDays,
          access_scope: accessScope,
        },
      });
      const requisition = await this.createRequisition({
        data: {
          redirect: "https://pipedream.com",
          institution_id: institutionId,
          reference: Date.now(),
          agreement: agreement.id,
          user_language: "EN",
        },
      });
      return requisition;
    },
    async deleteRequisitionLink(requisitionId, args = {}) {
      return this._makeRequest({
        path: `/requisitions/${requisitionId}/`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
