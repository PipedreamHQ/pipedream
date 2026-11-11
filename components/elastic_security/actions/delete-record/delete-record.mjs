import elasticSecurity from "../../elastic_security.app.mjs";

export default {
  key: "elastic_security-delete-record",
  name: "Delete Record",
  description: "Permanently delete an Elastic Security case or detection rule by ID."
    + " Cases are deleted via DELETE /api/cases; detection rules via DELETE /api/detection_engine/rules."
    + " Run **Find Cases** or **Find Detection Rules** first to obtain a valid ID for the object you want to delete."
    + " Example: calling with `objectType: \"case\"` and `recordId: \"a1c1...\"` returns `{ success: true, objectType: \"case\", recordId: \"a1c1...\" }`."
    + " This is destructive and cannot be undone."
    + " [See the delete case documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-deletecasedefaultspace) and the [delete rule documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-deleterule)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    objectType: {
      propDefinition: [
        elasticSecurity,
        "objectType",
      ],
      description: "The type of object to delete.",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the object to delete. For a case, its case ID from **Find Cases** (e.g. `a1c10c9b-8448-483a-81f7-a4b3225eb6b8`). For a detection rule, its Kibana internal UUID from **Find Detection Rules**' `id` field (e.g. `7ac3c66d-f0b4-4f7c-a576-7bb91bf4e9ce`) — not the user-defined `rule_id`.",
    },
  },
  async run({ $ }) {
    if (this.objectType === "case") {
      await this.elasticSecurity.deleteCase({
        $,
        params: {
          ids: JSON.stringify([
            this.recordId,
          ]),
        },
      });
      $.export("$summary", `Deleted case ${this.recordId}`);
      return {
        success: true,
        objectType: this.objectType,
        recordId: this.recordId,
      };
    }

    const response = await this.elasticSecurity.deleteDetectionRule({
      $,
      params: {
        id: this.recordId,
      },
    });
    $.export("$summary", `Deleted detection rule ${this.recordId}`);
    return response;
  },
};
