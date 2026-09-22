import servicenow from "../../servicenow.app.mjs";
import {
  assertSafeQueryValue,
  parseObject,
} from "../../common/utils.mjs";

export default {
  key: "servicenow-evaluate-field-change",
  name: "Evaluate Field Change",
  description: "Re-evaluate catalog/order-guide client scripts after a variable changes via Workday Scripted REST API. Call this when the user (or agent) updates a form field so visibility, mandatory, and default values stay in sync. [See the documentation](https://www.servicenow.com/docs/r/api-reference/rest-api-explorer/c_CustomWebServices.html)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
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
      description: "Catalog item or order-guide `sys_id` whose scripts should run. Run **Search Catalog Items** first. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
    },
    changedField: {
      propDefinition: [
        servicenow,
        "changedField",
      ],
    },
    value: {
      type: "string",
      label: "New Value",
      description: "New value of the changed variable. Example: `abc123`.",
    },
    variables: {
      propDefinition: [
        servicenow,
        "variables",
      ],
      description: "JSON object of the current form variable name-value pairs (including the changed field). Example: `{\"primary_location\":\"abc123\"}`.",
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.catalogItemSysId, "Catalog Item Sys ID");
    assertSafeQueryValue(this.changedField, "Changed Field");
    assertSafeQueryValue(this.requestedFor, "Requested For");

    const data = {
      sys_id: this.catalogItemSysId,
      field: this.changedField,
      value: this.value,
      variables: parseObject(this.variables) ?? {},
    };
    if (this.requestedFor) {
      data.requested_for = this.requestedFor;
    }

    const response = await this.servicenow.evaluateGuideScriptFieldChange({
      $,
      data,
    });

    $.export("$summary", `Evaluated field change ${this.changedField} on ${this.catalogItemSysId}`);
    return response;
  },
};
