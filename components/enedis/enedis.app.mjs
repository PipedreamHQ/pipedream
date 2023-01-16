import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "enedis",
  propDefinitions: {
    start: {
      label: "Start",
      description: "Start date of the period in RFC-3339 format (YYYY-MM-DD) e.g. '2022-10-28'. The returned datas will include the start date.",
      type: "string",
    },
    end: {
      label: "End",
      description: "End date of the period in RFC-3339 format (YYYY-MM-DD) e.g. '2022-11-01'. The returned datas will not include the end date.",
      type: "string",
    },
    usagePointId: {
      label: "Usage point id",
      description: "Usage point id known by the user. Use '12655648759651' if don't have one.",
      type: "string",
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://ext.hml.api.enedis.fr`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
		"User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
	},
    async _makeRequest({
      $,
      path,
	  params
    } = {}) {
      const config = {
        baseURL: this._getBaseUrl(),
        url: path,
        headers: this._getHeaders(),
        params,
      };
      return axios($ ?? this, config);
    },
    async getConsumptionLoadCurve(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_clc/v5/consumption_load_curve",
		params
      });
    },
    async getProductionLoadCurve(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_plc/v5/production_load_curve",
		params
      });
    },
    async getDailyConsumptionMaxPower(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_dcmp/v5/daily_consumption_max_power",
		params
      });
    },
    async getDailyConsumption(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_dc/v5/daily_consumption",
		params
      });
    },
    async getDailyProduction(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_dp/v5/daily_production",
		params
      });
    },
    async getIdentity(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_i/v5/identity",
		params
      });
    },
    async getContact(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_cd/v5/contact_data",
		params
      });
    },
    async getContracts(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_upc/v5/usage_points/contracts",
		params
      });
    },
    async getAddress(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_upa/v5/usage_points/addresses",
		params
      });
    },
  },
};
