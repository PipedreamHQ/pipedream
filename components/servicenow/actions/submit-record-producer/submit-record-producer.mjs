import { axios } from "@pipedream/platform";
import app from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-submit-record-producer",
  name: "Submit Record Producer",
  description: "Submit a ServiceNow record producer form — creates a record in the producer's target table (e.g. `incident`, `hr_case`, custom tables) by running the catalog workflow engine."
    + " **When to use:** the catalog item has `type: record_producer` (NOT `catalog_item`). Record producers are forms configured to create a specific record type via the catalog UX — like \"Report an Outage\", \"VPN Access Request\", \"New Hire Onboarding\". For normal orderable items use **Order Catalog Item** instead."
    + " **Returns:** `{ table, sys_id, number, redirect_url }` where `table` is the producer's target table and `number` is the created record's human-readable number."
    + " **Cross-references:** ALWAYS call **Get Catalog Item** first to see the producer's `variables` schema — you need each variable's `name`, `type`, and `mandatory` flag to build a valid payload."
    + " **Parameter guidance:** `variables` is a JSON object of variable `name` → value pairs. Example: `{\"justification\":\"testing\",\"duration\":\"30 days\"}`."
    + " **Common mistakes:** record producers differ from raw **Create Record** on the target table — producers run approval / assignment / SLA logic that a direct Table API insert skips. Use this tool (not **Create Record**) when the catalog intent is explicit."
    + " [See the documentation](https://docs.servicenow.com/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_ServiceCatalogAPI.html)",
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
