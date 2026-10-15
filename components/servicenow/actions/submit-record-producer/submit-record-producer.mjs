import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";

const SYS_ID_PATTERN = /^[0-9a-f]{32}$/i;

export default {
  key: "servicenow-submit-record-producer",
  name: "Submit Record Producer",
  description: "Submit a ServiceNow record producer to create the target record (e.g. an incident or RITM) from catalog variables. Run **Search Catalog Items** to find the record producer `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.10",
  type: "action",
  ai: "optimized",
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
    itemGuid: {
      propDefinition: [
        servicenow,
        "itemGuid",
      ],
      description: "Optional preallocated target-record sys_id used to stage required or variable attachments before submitting the producer.",
    },
  },
  async run({ $ }) {
    const itemGuid = String(this.itemGuid ?? "").trim();
    if (itemGuid && !SYS_ID_PATTERN.test(itemGuid)) {
      throw new ConfigurationError("Reserved Item GUID must be a 32-character hexadecimal sys_id.");
    }
    const response = await this.servicenow.submitRecordProducer({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        variables: parseObject(this.variables),
        ...(itemGuid && {
          sysparm_item_guid: itemGuid,
        }),
      },
      ...(this.sysparmView && {
        params: {
          sysparm_view: this.sysparmView,
        },
      }),
    });

    const recordId = response?.sys_id ?? response?.record_id;
    if (itemGuid && recordId !== itemGuid) {
      throw new ConfigurationError(
        "ServiceNow did not honor the reserved item GUID; staged attachments were not associated with the produced record.",
      );
    }
    const summary = recordId
      ? `Successfully submitted record producer ${this.catalogItemSysId} - created record ${recordId}`
      : `Successfully submitted record producer ${this.catalogItemSysId}`;
    $.export("$summary", summary);

    return response;
  },
};
