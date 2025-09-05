import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-bank-statements-report",
  name: "Bank Statements Report",
  description: "Gets bank statements for the specified bank account.",
  version: "0.1.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    bankAccountId: {
      label: "Bank Account ID",
      type: "string",
      description: "Xero identifier of the bank account to get bank statements of",
    },
    fromDate: {
      label: "From Date",
      type: "string",
      description: "Get the bank statements of the specified bank account from this date",
      optional: true,
    },
    toDate: {
      label: "To Date",
      type: "string",
      description: "Get the bank statements of the specified bank account to this date",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.bankAccountId) {
      throw new ConfigurationError("Must provide **Tenant ID**, and **Bank Account ID** parameters.");
    }

    const response = await this.xeroAccountingApi.getBankStatementsReport({
      $,
      tenantId: this.tenantId,
      params: {
        bankAccountId: this.bankAccountId,
        fromDate: this.fromDate,
        toDate: this.toDate,
      },
    });

    $.export("$summary", `Bank statements report retrieved successfully: ${this.bankAccountId}`);
    return response;
  },
};
