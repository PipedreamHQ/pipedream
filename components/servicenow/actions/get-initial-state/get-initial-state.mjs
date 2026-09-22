import servicenow from "../../servicenow.app.mjs";
import {
  assertSafeQueryValue,
  parseObject,
} from "../../common/utils.mjs";

export default {
  key: "servicenow-get-initial-state",
  name: "Get Initial State",
  description: "Load the initial catalog/order-guide form state via Workday Scripted REST (`GET /api/work2/guide_script_context/initial_state`). Use after **Get Order Guide Variables** or **Get Catalog Item Variables** to apply on-load catalog client scripts and UI policies. Requires that Scripted REST API on the instance.",
  version: "0.0.1",
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
      description: "Catalog item or order-guide `sys_id` to evaluate. Run **Search Catalog Items** first.",
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
