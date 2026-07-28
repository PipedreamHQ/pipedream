import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "servicenow-submit-record-producer",
  name: "Submit Record Producer",
  description: "Submit a ServiceNow record producer to create the target record (e.g. an incident or RITM) from catalog variables. Run **Search Catalog Items** to find the record producer `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    catalogItemSysId: {
      propDefinition: [
        servicenow,
        "catalogItemSysId",
      ],
      description: "The `sys_id` of the record producer to submit. Run **Search Catalog Items** first to find this value. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
    },
    variables: {
      propDefinition: [
        servicenow,
        "variables",
      ],
      description: "JSON object of variable name-value pairs for the record producer. Run **Get Catalog Item Variables** to discover valid names. Example: `{\"short_description\": \"laptop broken\"}`.",
    },
    sysparmView: {
      type: "string",
      label: "View",
      description: "Optional UI view used to render the response. Example: `ess`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.submitRecordProducer({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        variables: parseObject(this.variables),
      },
      ...(this.sysparmView && {
        params: {
          sysparm_view: this.sysparmView,
        },
      }),
    });

    const recordId = response?.sys_id ?? response?.record_id;
    const summary = recordId
      ? `Successfully submitted record producer ${this.catalogItemSysId} - created record ${recordId}`
      : `Successfully submitted record producer ${this.catalogItemSysId}`;
    $.export("$summary", summary);

    return response;
  },
};
