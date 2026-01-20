import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow_oauth_-create-table-record",
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
      propDefinition: [
        servicenow,
        "responseDataFormat",
      ],
    },
    excludeReferenceLinks: {
      propDefinition: [
        servicenow,
        "excludeReferenceLinks",
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
  },
  async run({ $ }) {
    const response = await this.servicenow.createTableRecord({
      $,
      table: this.table,
      data: parseObject(this.recordData),
      params: {
        sysparm_display_value: this.responseDataFormat,
        sysparm_exclude_reference_link: this.excludeReferenceLinks,
        sysparm_fields: this.responseFields?.join?.() || this.responseFields,
        sysparm_input_display_value: this.inputDisplayValue,
        sysparm_view: this.responseView,
      },
    });

    $.export("$summary", `Successfully created record in table "${this.table}"`);

    return response;
  },
};
