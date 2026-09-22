// x-pd-ai: optimized
import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import qs from "qs";
import { REPORT_STATES } from "../common/constants";

export default defineApp({
  type: "app",
  app: "expensify",
  propDefinitions: {
    policyExportIds: {
      type: "string[]",
      label: "Policy IDs",
      description: "The IDs of the policies to filter by. Run **List Policies** first to obtain valid IDs.",
      optional: true,
      async options() {
        const { policyList } = await this.listPolicies();
        return policyList?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    employeeEmail: {
      type: "string",
      label: "Employee Email",
      description: "The expenses will be created in this account",
    },
    policyId: {
      type: "string",
      label: "Policy ID",
      description: "The ID of the policy. Run **List Policies** first to obtain valid IDs.",
      optional: true,
    },
    reportState: {
      type: "string",
      label: "Report State",
      description: "Filter by report state. Valid values: OPEN, SUBMITTED, APPROVED, REIMBURSED, ARCHIVED.",
      options: REPORT_STATES,
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Filter to reports on or after this date, formatted yyyy-mm-dd (e.g. `2026-01-01`).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Filter to reports on or before this date, formatted yyyy-mm-dd (e.g. `2026-07-24`). Required by the API when the date range exceeds one year.",
      optional: true,
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
    async listPolicies({ $ = this } = {}) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "get",
          inputSettings: {
            type: "policyList",
          },
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
    async exportData({
      $, template, inputSettings,
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
            ...inputSettings,
          },
          outputSettings: {
            fileExtension: "json",
            fileSystem: "integrationServer",
          },
        },
        extraFormUrlencodedData: {
          template,
        },
      }, $);
    },
    async updateReportStatus({
      $, reportIDList, status, paymentSource,
    }) {
      return this._makeRequest({
        method: "post",
        data: {
          type: "update",
          inputSettings: {
            type: "reportStatus",
            filters: {
              reportIDList,
            },
            status,
            paymentSource,
          },
        },
      }, $);
    },
  },
});
