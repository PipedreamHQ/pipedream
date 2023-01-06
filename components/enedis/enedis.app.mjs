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
    usage_point_id: {
      label: "Usage point id",
      description: "Usage point id known by the user. You can use your own usage point or the virtual one: '10284856584123'.",
      type: "string",
    },
  },
  methods: {
    _getUrl(path) {
      return `https://ext.hml.api.enedis.fr${path}`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
		"User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
	},
    prepareParam(self) {
      return {
        "usage_point_id": self.usage_point_id,
      };
    },
    prepareAllParams(self) {
      return {
        "usage_point_id": self.usage_point_id,
        "start": self.start,
        "end": self.end,
      };
    },
    async _makeRequest({
      $,
      path,
	  params
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(),
        params,
      };
      return axios($ ?? this, config);
    },
    async consumptionLoadCurve(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_clc/v5/consumption_load_curve",
		params
      });
    },
    async productionLoadCurve(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_plc/v5/production_load_curve",
		params
      });
    },
    async dailyConsumptionMaxPower(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_dcmp/v5/daily_consumption_max_power",
		params
      });
    },
    async dailyConsumption(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_dc/v5/daily_consumption",
		params
      });
    },
    async dailyProduction(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/metering_data_dp/v5/daily_production",
		params
      });
    },
    async identity(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_i/v5/identity",
		params
      });
    },
    async contact(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_cd/v5/contact_data",
		params
      });
    },
    async contracts(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_upc/v5/usage_points/contracts",
		params
      });
    },
    async address(params) {
      return await this._makeRequest({
        method: "GET",
        path: "/customers_upa/v5/usage_points/addresses",
		params
      });
    },
  },
};
