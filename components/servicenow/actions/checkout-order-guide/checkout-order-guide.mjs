import servicenow from "../../servicenow.app.mjs";
import {
  normalizeGuideCheckoutItems,
  parseObject,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "servicenow-checkout-order-guide",
  name: "Checkout Order Guide",
  description: "Checkout a ServiceNow order guide using the items returned by **Submit Order Guide**. Pass those items as-is — this action maps `quantity` to `sysparm_quantity` and array `variables` to an object. Like **Checkout Cart**, the result depends on one-step vs two-step checkout (in two-step mode it returns the order summary/status to confirm rather than finalizing; do not follow with **Submit Cart Order**). Use **Check Order Status** afterward. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.3",
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
    if (parsed && !Array.isArray(parsed)) {
      throw new ConfigurationError("Items must be a JSON array from Submit Order Guide, not a JSON object.");
    }
    const items = normalizeGuideCheckoutItems(parsed);
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
