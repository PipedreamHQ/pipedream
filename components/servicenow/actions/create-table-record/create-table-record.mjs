import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-create-table-record",
  name: "Create Table Record",
  description: "Inserts one record in the specified table.",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
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
    tableRecord: {
      type: "object",
      description: "The table record object. Use name-value pairs for each field of the record.",
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
    sysparmExcludeReferenceLink: {
      type: "boolean",
      description: "Flag that indicates whether to exclude Table API links for reference fields.\n* `true`: Exclude Table API links for reference fields.\n* `false`: Include Table API links for reference fields.",
      optional: true,
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
  },
  async run({ $ }) {
  // See the API docs: https://docs.servicenow.com/bundle/paris-application-development/page/integrate/inbound-rest/concept/c_TableAPI.html#table-POST

    return await this.servicenow.createTableRecord({
      $,
      table: this.table,
      data: this.tableRecord,
      params: {
        sysparm_display_value: this.sysparmDisplayValue,
        sysparm_exclude_reference_link: this.sysparmExcludeReferenceLink,
        sysparm_fields: this.sysparmFields,
        sysparm_input_display_value: this.sysparmInputDisplayValue,
        sysparm_view: this.sysparmView,
      },
    });
  },
};
