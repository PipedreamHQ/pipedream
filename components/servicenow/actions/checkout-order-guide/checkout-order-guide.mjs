import servicenow from "../../servicenow.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "servicenow-checkout-order-guide",
  name: "Checkout Order Guide",
  description: "Checkout a ServiceNow order guide using the items returned by **Submit Order Guide**. Each item needs `sys_id`, `sysparm_quantity`, and item-level `variables`. When two-step checkout is on, this may return a summary without a REQ — then call **Submit Cart Order**. Use **Check Order Status** afterward. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
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
        "guideSysId",
      ],
    },
    items: {
      propDefinition: [
        servicenow,
        "guideItems",
      ],
    },
  },
  async run({ $ }) {
    const parsed = parseObject(this.items);
    const items = Array.isArray(parsed)
      ? parsed
      : [];
    if (!items.length) {
      throw new ConfigurationError("Items must be a non-empty JSON array from Submit Order Guide.");
    }

    const response = await this.servicenow.checkoutOrderGuide({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        items,
      },
    });

    const requestNumber = response?.request_number ?? response?.number ?? response?.request_id;
    const summary = requestNumber
      ? `Successfully checked out order guide ${this.catalogItemSysId} - request ${requestNumber}`
      : `Successfully checked out order guide ${this.catalogItemSysId}`;
    $.export("$summary", summary);

    return response;
  },
};
