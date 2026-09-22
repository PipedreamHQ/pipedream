import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-evaluated-variable-options",
  name: "Get Evaluated Variable Options",
  description: "Retrieve evaluated choice lists for mandatory catalog variables via Workday Agent Cart Scripted REST (`GET /api/work2/agent_cart/variables?sys_id=`). Use after **Get Catalog Item Variables** or **Get Order Guide Variables** for reference, lookup-select, and list-collector fields that have no inline choices. Select-box (`question_choice`) values can also come from **Get Question Choices**. Requires the Agent Cart Scripted REST API on the instance.",
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
      description: "Catalog item or order-guide `sys_id` whose mandatory variables should be evaluated. Run **Search Catalog Items** first.",
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.catalogItemSysId, "Catalog Item Sys ID");

    const response = await this.servicenow.getEvaluatedVariableOptions({
      $,
      params: {
        sys_id: this.catalogItemSysId,
      },
    });

    const variables = Array.isArray(response?.variables)
      ? response.variables
      : [];
    $.export("$summary", `Retrieved evaluated options for ${variables.length} variable(s) on ${this.catalogItemSysId}`);

    return response;
  },
};
