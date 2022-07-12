import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import qs from "qs";

export default defineApp({
  type: "app",
  app: "expensify",
  propDefinitions: {},
  methods: {
    _partnerUserId() {
      return this.$auth.partnerUserId;
    },
    _partnerUserSecret() {
      return this.$auth.partnerUserSecret;
    },
    _apiUrl() {
      return "https://integrations.expensify.com/Integration-Server/ExpensifyIntegrations";
    },
    async _makeRequest(options: any = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}`,
        ...options,
        data: qs.stringify({
          requestJobDescription: JSON.stringify({
            credentials: {
              partnerUserID: this._partnerUserId(),
              partnerUserSecret: this._partnerUserSecret(),
            },
            ...options?.data,
          }),
        }),
      });
    },
    async createExpense({
      $, data,
    }) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "create",
          inputSettings: {
            type: "expenses",
            ...data,
          },
        },
      }, $);
    },
    async exportReportToPDF({
      $, data,
    }) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "create",
          inputSettings: {
            type: "expenses",
            ...data,
          },
        },
      }, $);
    },
  },
});
