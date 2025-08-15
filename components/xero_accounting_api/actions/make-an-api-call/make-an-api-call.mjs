import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-make-an-api-call",
  name: "Make API Call",
  description: "Makes an aribitrary call to Xero Accounting API.",
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
    requestMethod: {
      label: "Request Method",
      type: "string",
      description: "Http method to use in the request.",
      options: [
        "get",
        "post",
        "put",
        "patch",
        "delete",
      ],
    },
    relativeUrl: {
      label: "Relative URL",
      type: "string",
      description: "A path relative to Xero Accounting API to send the request against.",
    },
    queryString: {
      label: "Query String",
      type: "string",
      description: "Query string of the request.",
      optional: true,
    },
    headers: {
      label: "Headers",
      type: "object",
      description: "Headers to send in the request. Must include header `xero-tenant-id` with Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    requestBody: {
      label: "Request Body",
      type: "object",
      description: "Body of the request.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.requestMethod || !this.relativeUrl) {
      throw new ConfigurationError("Must provide **Tenant ID**, **Request Method**, and **Relative URL** parameters.");
    }

    const response = await this.xeroAccountingApi._makeRequest({
      $,
      method: this.requestMethod,
      path: this.relativeUrl,
      params: this.queryString,
      headers: parseObject(this.headers),
      data: parseObject(this.requestBody),
    });

    $.export("$summary", `Successfully made API call to ${this.relativeUrl}`);
    return response;
  },
};
