// legacy_hash_id: a_wdid84
import { axios } from "@pipedream/platform";

export default {
  key: "servicenow-get-table-records",
  name: "Get Table Records",
  description: "Retrieves multiple records for the specified table.",
  version: "0.3.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicenow: {
      type: "app",
      app: "servicenow",
    },
    table_name: {
      type: "string",
      description: "The name of the table containing the records to retrieve.",
    },
    api_version: {
      type: "string",
      description: "API version number. Version numbers identify the endpoint version that a URI accesses. By specifying a version number in your URIs, you can ensure that future updates to the REST API do not negatively impact your integration. Use `lastest` to use the latest REST endpoint for your instance version.",
      optional: true,
      options: [
        "lastest",
        "v1",
        "v2",
      ],
    },
    request_format: {
      type: "string",
      description: "Format of REST request body",
      optional: true,
      options: [
        "application/json",
        "application/xml",
        "text/xml",
      ],
    },
    response_format: {
      type: "string",
      description: "Format of REST response body.",
      optional: true,
      options: [
        "application/json",
        "application/xml",
        "text/xml",
      ],
    },
    sysparm_query: {
      type: "string",
      optional: true,
    },
    sysparm_display_value: {
      type: "string",
      description: "Return field display values (true), actual values (false), or both (all) (default: false).",
      optional: true,
      options: [
        "true",
        "false",
        "all",
      ],
    },
    sysparm_exclude_reference_link: {
      type: "boolean",
      description: "True to exclude Table API links for reference fields (default: false).",
      optional: true,
    },
    sysparm_suppress_pagination_header: {
      type: "boolean",
      description: "True to supress pagination header (default: false).",
      optional: true,
    },
    sysparm_fields: {
      type: "string",
      description: "A comma-separated list of fields to return in the response.",
      optional: true,
    },
    sysparm_limit: {
      type: "string",
      description: "The maximum number of results returned per page (default: 10,000).",
      optional: true,
    },
    sysparm_view: {
      type: "string",
      description: "Render the response according to the specified UI view (overridden by sysparm_fields).",
      optional: true,
    },
    sysparm_query_category: {
      type: "string",
      description: "Name of the query category (read replica category) to use for queries.",
      optional: true,
    },
    sysparm_query_no_domain: {
      type: "boolean",
      description: "True to access data across domains if authorized (default: false).",
      optional: true,
    },
    sysparm_no_count: {
      type: "boolean",
      description: "Do not execute a select count(*) on table (default: false).",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://docs.servicenow.com/bundle/paris-application-development/page/integrate/inbound-rest/concept/c_TableAPI.html#table-GET-id                    */

    if (!this.table_name) {
      throw new Error("Must provide table_name parameter.");
    }

    var apiVersion = "";
    if (this.api_version == "v1" || this.api_version == "v2") {
      apiVersion = this.api_version + "/";
    }

    return await axios($, {
      url: `https://${this.servicenow.$auth.instance_name}.service-now.com/api/now/${apiVersion}table/${this.table_name}`,
      headers: {
        "Authorization": `Bearer ${this.servicenow.$auth.oauth_access_token}`,
        "Accept": this.request_format || "application/json",
        "Content-Type": this.response_format || "application/json",
      },
      params: {
        sysparm_query: this.sysparm_query,
        sysparm_display_value: this.sysparm_display_value,
        sysparm_exclude_reference_link: this.sysparm_exclude_reference_link,
        sysparm_suppress_pagination_header: this.sysparm_suppress_pagination_header,
        sysparm_fields: this.sysparm_fields,
        sysparm_limit: this.sysparm_limit,
        sysparm_view: this.sysparm_view,
        sysparm_query_category: this.sysparm_query_category,
        sysparm_query_no_domain: this.sysparm_query_no_domain,
        sysparm_no_count: this.sysparm_no_count,
      },
    });
  },
};
