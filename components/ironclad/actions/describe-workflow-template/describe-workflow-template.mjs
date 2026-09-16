import ironclad from "../../ironclad.app.mjs";
import {
  getAttributeDescription, inferConditionalDependencies,
} from "../../common/utils.mjs";

export default {
  key: "ironclad-describe-workflow-template",
  name: "Describe Workflow Template",
  description: "Retrieves the fillable attribute schema for an Ironclad workflow template — the required call before **Launch Workflow**. Returns each field's type, display name, enum options, and whether it's required. Every field's `description` already includes a worked value-format example for complex types (`address`, `monetaryAmount`, `date`, `duration`, `document`/`array`) — use those examples verbatim, do not guess a shape. A field's `required` may be `\"conditional\"`: when Ironclad's naming convention makes the trigger inferable (e.g. a field named `set1Question2` triggered by a selector field set to `\"Set 1\"`), a `dependsOn: {field, value}` hint is included; whenever you set the selector to that value, also include the dependent field. If a conditional field has no `dependsOn` hint, its trigger isn't inferable from naming — watch for a `MISSING_PARAM` error naming it after you submit **Launch Workflow**, and retry with it included. Run **Describe Workspace** first to find a template ID. Example: set `templateId` to `\"tmpl_abc123\"` to retrieve a schema where each field looks like `{\"counterpartyName\": {\"type\": \"string\", \"displayName\": \"Counterparty Name\", \"required\": \"always\", \"description\": \"Value of Counterparty Name\"}, \"requiredAddress\": {\"type\": \"address\", \"displayName\": \"Required Address\", \"required\": \"always\", \"description\": \"Value of Required Address. Example: {\\\"lines\\\": [...], \\\"locality\\\": ..., \\\"region\\\": ..., \\\"postcode\\\": ..., \\\"country\\\": ...}\"}}`. [See the documentation](https://developer.ironcladapp.com/reference/retrieve-a-workflow-schema)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ironclad,
    templateId: {
      propDefinition: [
        ironclad,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ironclad.getWorkflowSchema({
      $,
      templateId: this.templateId,
    });

    const schema = inferConditionalDependencies(response.schema ?? {});
    for (const field of Object.values(schema)) {
      field.description = getAttributeDescription(field);
    }

    $.export("$summary", `Retrieved schema for template ${this.templateId}`);
    return {
      ...response,
      schema,
    };
  },
};
