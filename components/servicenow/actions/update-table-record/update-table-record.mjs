// legacy_hash_id: a_4riE2J
import { axios } from "@pipedream/platform";

export default {
  key: "servicenow-update-table-record",
  name: "Update Table Record",
  description: "Updates the specified record with the name-value pairs included in the request body.",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicenow: {
      type: "app",
      app: "servicenow",
    },
    table_name: {
      type: "string",
      description: "The name of the table containing the record to update.",
    },
    sys_id: {
      type: "string",
      description: "Unique identifier of the record to update.",
    },
    update_fields: {
      type: "object",
      description: "An object with name-value pairs with the fields to update in the specified record.\n**Note:** All fields within a record may not be available for update. For example, fields that have a prefix of \"sys_\" are typically system parameters that are automatically generated and cannot be updated.",
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
    x_no_response_body: {
      type: "boolean",
      description: "By default, responses include body content detailing the modified record. Set this request header to true to suppress the response body.",
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
    sysparm_fields: {
      type: "string",
      description: "A comma-separated list of fields to return in the response.",
      optional: true,
    },
    sysparm_input_display_value: {
      type: "boolean",
      description: "Flag that indicates whether to set field values using the display value or the actual value.\n* `true`: Treats input values as display values and they are manipulated so they can be stored properly in the database.\n* `false`: Treats input values as actual values and stored them in the database without manipulation.",
      optional: true,
    },
    sysparm_view: {
      type: "string",
      description: "Render the response according to the specified UI view (overridden by sysparm_fields).",
      optional: true,
      options: [
        "desktop",
        "mobile",
        "both",
      ],
    },
    sysparm_query_no_domain: {
      type: "boolean",
      description: "True to access data across domains if authorized (default: false).",
      optional: true,
    },
  },
  async run({ $ }) {
  /* See the API docs: https://docs.servicenow.com/bundle/paris-application-development/page/integrate/inbound-rest/concept/c_TableAPI.html#c_TableAPI
    Section Table - PATCH /now/table/{tableName}/{sys_id}                      */

    if (!this.table_name || !this.sys_id || !this.update_fields) {
      throw new Error("Must provide table_name, sys_id, and update_fields parameters.");
    }

    var apiVersion = "";
    if (this.api_version == "v1" || this.api_version == "v2") {
      apiVersion = this.api_version + "/";
    }

    return await axios($, {
      method: "patch",
      url: `https://${this.servicenow.$auth.instance_name}.service-now.com/api/now/${apiVersion}table/${this.table_name}/${this.sys_id}`,
      headers: {
        "Authorization": `Bearer ${this.servicenow.$auth.oauth_access_token}`,
        "Accept": this.request_format || "application/json",
        "Content-Type": this.response_format || "application/json",
        "X-no-response-body": this.x_no_response_body,
      },
      params: {
        sysparm_display_value: this.sysparm_display_value,
        sysparm_fields: this.sysparm_fields,
        sysparm_input_display_value: this.sysparm_input_display_value,
        sysparm_view: this.sysparm_view,
        sysparm_query_no_domain: this.sysparm_query_no_domain,
      },
      data: this.update_fields,
    });
  },
};
