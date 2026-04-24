import { axios } from "@pipedream/platform";
import app from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-submit-record-producer",
  name: "Submit Record Producer",
  description: "Submits a Record Producer from the ServiceNow service catalog. Record producers are catalog items that directly create records in a target table (e.g., VPN access requests, HR cases, facilities requests). Use this instead of order-catalog-item when the catalog item is a record producer type.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sys_id: {
      type: "string",
      label: "Record Producer sys_id",
      description: "`sys_id` of the record producer catalog item. Get this from **List Catalog Items** (filter to items where `type: record_producer`).",
    },
    variables: {
      type: "string",
      label: "Variables",
      description: "JSON object of variable `name` → value pairs. Example: `{\"justification\":\"testing\",\"affected_user\":\"6816f79cc0a8016401c5a33be04be441\"}`. Use **Get Catalog Item** to discover the schema.",
    },
  },
  async run({ $ }) {
    const variables = parseObject(this.variables) ?? {};

    const response = await axios($, {
      method: "POST",
      url: `${this.app.baseUrl()}/api/sn_sc/servicecatalog/items/${this.sys_id}/submit_producer`,
      headers: {
        ...this.app.authHeaders(),
        "Content-Type": "application/json",
      },
      data: {
        variables,
      },
    });

    const result = response.result ?? {};
    const identifier = result.number || result.sys_id || "(unknown)";
    const table = result.table
      ? ` in ${result.table}`
      : "";
    $.export("$summary", `Submitted record producer — created ${identifier}${table}`);

    return result;
  },
};
