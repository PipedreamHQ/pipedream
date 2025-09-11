import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import qs from "qs";

export default defineApp({
  type: "app",
  app: "expensify",
  propDefinitions: {
    employeeEmail: {
      type: "string",
      label: "Employee Email",
      description: "The expenses will be created in this account.",
    },
    policyId: {
      type: "string",
      label: "Policy ID",
      description: "Select the policy where the report will be created.",
      async options({ userEmail }) {
        const { policyList } = await this.getPolicyList({
          userEmail,
        });
        return policyList?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _makeRequest(options: any = {}, $ = this) {
      const {
        extraFormUrlencodedData,
        data,
        ...rest
      } = options;
      const response = await axios($, {
        url: `${this._apiUrl()}`,
        ...rest,
        data: qs.stringify({
          requestJobDescription: JSON.stringify({
            credentials: {
              partnerUserID: this._partnerUserId(),
              partnerUserSecret: this._partnerUserSecret(),
            },
            ...data,
          }),
          ...extraFormUrlencodedData,
        }),
      });

      if (response.responseCode < 200 || response.responseCode >= 300) {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
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
    async createReport({
      $, data,
    }) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "create",
          inputSettings: {
            type: "report",
            ...data,
          },
        },
      }, $);
    },
    async getPolicyList({
      $, userEmail, adminOnly = true,
    }) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "get",
          inputSettings: {
            type: "policyList",
            adminOnly,
            ...(userEmail && {
              userEmail,
            }),
          },
        },
      }, $);
    },
    async updateCustomer({
      $, data,
    }) {
      return this._makeRequest({
        method: "update",
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
      $, reportId,
    }) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "file",
          onReceive: {
            immediateResponse: [
              "returnRandomFileName",
            ],
          },
          inputSettings: {
            type: "combinedReportData",
            filters: {
              reportIDList: reportId,
            },
          },
          outputSettings: {
            fileExtension: "pdf",
          },
        },
        extraFormUrlencodedData: {
          template: "default",
        },
      }, $);
    },

    async downloadFile({
      $, fileName,
    }) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "download",
          fileName,
          fileSystem: "integrationServer",
        },
        responseType: "arraybuffer",
      }, $);
    },
  },
});
