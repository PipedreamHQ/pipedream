import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import {
  assertSysId,
  parseObject,
} from "../../common/utils.mjs";

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
      description: "Optional caller-supplied target-record sys_id reserved before staging attachments. This action validates and forwards the value; it does not generate or retrieve it. Example reserved target-record value: `46a1c7d2e8f94b6c9a0d1e2f3a4b5c6d`.",
    },
  },
  async run({ $ }) {
    const itemGuid = assertSysId(this.itemGuid, "Reserved Item GUID", {
      optional: true,
      trim: true,
    });
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
