import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-table-record-by-sysid",
  name: "Get Table Record By SysId",
  description: "Retrieves the record identified by the specified sys_id from the specified table.",
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
    sysId: {
      type: "string",
      description: "Unique identifier of the record to retrieve.",
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
      description: "True to exclude Table API links for reference fields (default: false).",
      optional: true,
    },
    sysparmFields: {
      type: "string",
      description: "A comma-separated list of fields to return in the response.",
      optional: true,
    },
    sysparmView: {
      type: "string",
      description: "Render the response according to the specified UI view (overridden by sysparm_fields).",
      optional: true,
    },
    sysparmQueryNoDomain: {
      type: "boolean",
      description: "True to access data across domains if authorized (default: false).",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://docs.servicenow.com/bundle/paris-application-development/page/integrate/inbound-rest/concept/c_TableAPI.html#table-GET-id                      */

    return await this.servicenow.getTableRecordBySysId({
      $,
      table: this.table,
      sysId: this.sysId,
      params: {
        sysparm_display_value: this.sysparmDisplayValue,
        sysparm_exclude_reference_link: this.sysparmExcludeReferenceLink,
        sysparm_fields: this.sysparmFields,
        sysparm_view: this.sysparmView,
        sysparm_query_no_domain: this.sysparmQueryNoDomain,
      },
    });
  },
};
