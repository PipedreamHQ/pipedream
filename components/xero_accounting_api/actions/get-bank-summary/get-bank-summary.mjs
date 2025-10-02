import { ConfigurationError } from "@pipedream/platform";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-bank-summary",
  name: "Get Bank Summary",
  description: "Gets the balances and cash movements for each bank account.",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      description: "Id of the bank account to get the summary for.",
    },
    fromDate: {
      label: "From Date",
      type: "string",
      description: "Get the balances and cash movements for the specified bank account from this date",
      optional: true,
    },
    toDate: {
      label: "To Date",
      type: "string",
      description: "Get the balances and cash movements for the specified bank account to this date",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.bankAccountId) {
      throw new ConfigurationError("Must provide **Tenant ID**, and **Bank Account ID** parameters.");
    }

    const response = await this.xeroAccountingApi.getBankSummary({
      $,
      tenantId: this.tenantId,
      bankAccountId: this.bankAccountId,
      params: {
        fromDate: this.fromDate,
        toDate: this.toDate,
      },
    });

    $.export("$summary", `Bank summary retrieved successfully: ${this.bankAccountId}`);
    return response;
  },
};
