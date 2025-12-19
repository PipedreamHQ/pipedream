import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-tenant-connections",
  name: "Get Tenant Connections",
  description: "Gets the tenants connections the user is authorized to access",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    xeroAccountingApi,
  },
  async run({ $ }) {
    const response = await this.xeroAccountingApi.getTenantConnections({
      $,
    });

    $.export("$summary", "Successfully fetched tenant connections");
    return response;
  },
};
