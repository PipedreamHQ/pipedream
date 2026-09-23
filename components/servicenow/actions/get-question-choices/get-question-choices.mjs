import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-question-choices",
  name: "Get Question Choices",
  description: "Retrieve select-box choices for a ServiceNow catalog variable from the `question_choice` table. Run **Get Catalog Item Variables** first and pass the variable `sys_id` (or `id`). For table-backed reference variables, use **Get Table Records** on the variable's lookup table instead. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    variableSysId: {
      propDefinition: [
        servicenow,
        "variableSysId",
      ],
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.variableSysId, "Variable Sys ID");

    const response = await this.servicenow.getQuestionChoices({
      $,
      params: {
        sysparm_query: `question=${this.variableSysId}^inactive=false^ORDERBYorder`,
        sysparm_limit: this.limit,
      },
    });

    const choices = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Retrieved ${choices.length} question choice(s) for variable ${this.variableSysId}`);

    return response;
  },
};
