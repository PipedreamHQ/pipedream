import servicenow from "../../servicenow.app.mjs";
import {
  assertSafeQueryValue,
  parseObject,
} from "../../common/utils.mjs";

export default {
  key: "servicenow-get-initial-state",
  name: "Get Initial State",
  description: "Load the initial catalog/order-guide form state via Workday Scripted REST API. Use after **Get Order Guide Variables** or **Get Catalog Item Variables** to apply on-load catalog client scripts and UI policies. [See the documentation](https://www.servicenow.com/docs/r/api-reference/rest-api-explorer/c_CustomWebServices.html)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    catalogItemSysId: {
      propDefinition: [
        servicenow,
        "catalogItemSysId",
      ],
      description: "Catalog item or order-guide `sys_id` to evaluate. Run **Search Catalog Items** first. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
    },
    variables: {
      propDefinition: [
        servicenow,
        "variables",
      ],
      description: "Optional current variable name-value pairs to seed the form state. Example: `{\"primary_location\":\"abc123\"}`.",
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.catalogItemSysId, "Catalog Item Sys ID");
    assertSafeQueryValue(this.requestedFor, "Requested For");

    const params = {
      sys_id: this.catalogItemSysId,
    };
    if (this.requestedFor) {
      params.requested_for = this.requestedFor;
    }
    const parsedVariables = parseObject(this.variables);
    if (parsedVariables) {
      params.variables = JSON.stringify(parsedVariables);
    }

    const response = await this.servicenow.getGuideScriptInitialState({
      $,
      params,
    });

    $.export("$summary", `Retrieved initial guide-script state for ${this.catalogItemSysId}`);
    return response;
  },
};
