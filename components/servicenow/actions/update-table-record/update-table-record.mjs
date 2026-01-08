import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-update-table-record",
  name: "Update Table Record",
  description: "Updates the specified record with the name-value pairs included in the request body.",
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
    sysId: {
      type: "string",
      description: "Unique identifier of the record to update.",
    },
    updateFields: {
      type: "object",
      description: "An object with name-value pairs with the fields to update in the specified record.\n**Note:** All fields within a record may not be available for update. For example, fields that have a prefix of \"sys_\" are typically system parameters that are automatically generated and cannot be updated.",
    },
    sysparmDisplayValue: {
      type: "string",
      description: "Return field display values (true), actual values (false), or both (all) (default: false).",
      optional: true,
      options: [
        "true",
        "false",
        "all",
      ],
    },
    sysparmFields: {
      type: "string",
      description: "A comma-separated list of fields to return in the response.",
      optional: true,
    },
    sysparmInputDisplayValue: {
      type: "boolean",
      description: "Flag that indicates whether to set field values using the display value or the actual value.\n* `true`: Treats input values as display values and they are manipulated so they can be stored properly in the database.\n* `false`: Treats input values as actual values and stored them in the database without manipulation.",
      optional: true,
    },
    sysparmView: {
      type: "string",
      description: "Render the response according to the specified UI view (overridden by sysparm_fields).",
      optional: true,
      options: [
        "desktop",
        "mobile",
        "both",
      ],
    },
    sysparmQueryNoDomain: {
      type: "boolean",
      description: "True to access data across domains if authorized (default: false).",
      optional: true,
    },
  },
  async run({ $ }) {
  /* See the API docs: https://docs.servicenow.com/bundle/paris-application-development/page/integrate/inbound-rest/concept/c_TableAPI.html#c_TableAPI
    Section Table - PATCH /now/table/{tableName}/{sys_id}                      */

    return await this.servicenow.updateTableRecord({
      $,
      table: this.table,
      sysId: this.sysId,
      data: this.updateFields,
      params: {
        sysparm_display_value: this.sysparmDisplayValue,
        sysparm_fields: this.sysparmFields,
        sysparm_input_display_value: this.sysparmInputDisplayValue,
        sysparm_view: this.sysparmView,
        sysparm_query_no_domain: this.sysparmQueryNoDomain,
      },
    });
  },
};
