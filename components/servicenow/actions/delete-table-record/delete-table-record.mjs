import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow_oauth_-delete-table-record",
  name: "Delete Table Record",
  description: "Deletes the specified record from a table. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-DELETE)",
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
    queryNoDomain: {
      propDefinition: [
        servicenow,
        "queryNoDomain",
      ],
    },
  },
  async run({ $ }) {
    await this.servicenow.deleteTableRecord({
      $,
      table: this.table,
      recordId: this.recordId,
      params: {
        sysparm_query_no_domain: this.queryNoDomain,
      },
    });

    $.export("$summary", `Successfully deleted record ${this.recordId} from table "${this.table}"`);

    return {
      success: true,
      recordId: this.recordId,
      table: this.table,
    };
  },
};
