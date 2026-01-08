import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-create-table-record",
  name: "Create Table Record",
  description: "Inserts one record in the specified table. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-POST)",
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
    recordData: {
      label: "Record Data",
      type: "object",
      description: "The data to create the record with, as key-value pairs (e.g. `{ \"name\": \"John Doe\", \"email\": \"john.doe@example.com\" }`)",
    },
    responseDataFormat: {
      label: "Response Data Format",
      type: "string",
      description: "The format to return response fields in",
      optional: true,
      options: [
        {
          value: "true",
          label: "Returns the display values for all fields",
        },
        {
          value: "false",
          label: "Returns the actual values from the database",
        },
        {
          value: "all",
          label: "Returns both actual and display values",
        },
      ],
    },
    excludeReferenceLinks: {
      type: "boolean",
      label: "Exclude Reference Links",
      description: "If true, the response excludes Table API links for reference fields",
      optional: true,
    },
    responseFields: {
      type: "string[]",
      label: "Response Fields",
      description: "The fields to return in the response. By default, all fields are returned",
      optional: true,
    },
    allowInputDisplayValue: {
      label: "Input Display Value",
      type: "boolean",
      description: "If true, the input values are treated as display values (and they are manipulated so they can be stored properly in the database).",
      optional: true,
    },
    responseView: {
      label: "Response View",
      type: "string",
      description: "Render the response according to the specified UI view (overridden by `Response Fields`).",
      optional: true,
      options: [
        "desktop",
        "mobile",
        "both",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.createTableRecord({
      $,
      table: this.table,
      data: this.recordData,
      params: {
        sysparm_display_value: this.responseDataFormat,
        sysparm_exclude_reference_link: this.excludeReferenceLinks,
        sysparm_fields: this.responseFields,
        sysparm_input_display_value: this.allowInputDisplayValue,
        sysparm_view: this.responseView,
      },
    });

    $.export("$summary", `Successfully created record in table "${this.table}"`);

    return response;
  },
};
