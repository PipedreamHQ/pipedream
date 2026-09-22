import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-evaluated-variable-options",
  name: "Get Evaluated Variable Options",
  description: "Retrieve evaluated choice lists for mandatory catalog variables via a Workday Agent Cart Scripted REST API. Use after **Get Catalog Item Variables** or **Get Order Guide Variables** for reference, lookup-select, and list-collector fields that have no inline choices. Select-box (`question_choice`) values can also come from **Get Question Choices**. [See the documentation](https://www.servicenow.com/docs/r/api-reference/rest-api-explorer/c_CustomWebServices.html)",
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
      description: "Catalog item or order-guide `sys_id` whose mandatory variables should be evaluated. Run **Search Catalog Items** first. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
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
