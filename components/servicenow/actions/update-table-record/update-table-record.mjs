import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow_oauth_-update-table-record",
  name: "Update Table Record",
  description: "Updates the specified record with the name-value pairs included in the request body. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-PATCH)",
  version: "1.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicenow,
    table: {
      propDefinition: [
        servicenow,
        "table",
      ],
    },
    recordId: {
      propDefinition: [
        servicenow,
        "recordId",
      ],
    },
    updateFields: {
      label: "Update Fields",
      type: "object",
      description: "The fields to update in the record, as key-value pairs (e.g. `{ \"name\": \"Jane Doe\", \"status\": \"active\" }`). **Note:** System fields (prefixed with `sys_`) are typically auto-generated and cannot be updated.",
    },
    responseDataFormat: {
      propDefinition: [
        servicenow,
        "responseDataFormat",
      ],
    },
    responseFields: {
      propDefinition: [
        servicenow,
        "responseFields",
      ],
    },
    inputDisplayValue: {
      propDefinition: [
        servicenow,
        "inputDisplayValue",
      ],
    },
    responseView: {
      propDefinition: [
        servicenow,
        "responseView",
      ],
    },
    queryNoDomain: {
      propDefinition: [
        servicenow,
        "queryNoDomain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.updateTableRecord({
      $,
      table: this.table,
      recordId: this.recordId,
      data: this.updateFields,
      params: {
        sysparm_display_value: this.responseDataFormat,
        sysparm_fields: this.responseFields?.join?.() || this.responseFields,
        sysparm_input_display_value: this.inputDisplayValue,
        sysparm_view: this.responseView,
        sysparm_query_no_domain: this.queryNoDomain,
      },
    });

    $.export("$summary", `Successfully updated record ${this.recordId} in table "${this.table}"`);

    return response;
  },
};
