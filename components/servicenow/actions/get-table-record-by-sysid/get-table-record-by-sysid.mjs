import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow_oauth_-get-table-record-by-recordId",
  name: "Get Table Record by ID",
  description: "Retrieves a single record from a table by its ID (allows searching). [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-GET-id)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.servicenow.getTableRecordByrecordId({
      $,
      table: this.table,
      recordId: this.recordId,
      params: {
        sysparm_display_value: this.responseDataFormat,
        sysparm_exclude_reference_link: this.excludeReferenceLinks,
        sysparm_fields: this.responseFields?.join?.() || this.responseFields,
        sysparm_view: this.responseView,
        sysparm_query_no_domain: this.queryNoDomain,
      },
    });

    $.export("$summary", `Successfully retrieved record ${this.recordId} from table "${this.table}"`);

    return response;
  },
};
