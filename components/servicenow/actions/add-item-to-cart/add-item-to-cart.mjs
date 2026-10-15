import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";
import {
  catalogCartItems,
  parseObject,
} from "../../common/utils.mjs";

const SYS_ID_PATTERN = /^[0-9a-f]{32}$/i;

function enrichedResponse(response, cartItemId) {
  const body = response && typeof response === "object" && !Array.isArray(response)
    ? response
    : {
      result: response,
    };
  return cartItemId
    ? {
      ...body,
      cart_item_id: cartItemId,
    }
    : body;
}

export default {
  key: "servicenow-add-item-to-cart",
  name: "Add Item to Cart",
  description: "Add a ServiceNow catalog item to the current user's cart. Run **Search Catalog Items** to find the item `sys_id` and **Get Catalog Item Variables** to learn which variable names to supply. After adding items, use **View Cart**, then **Checkout Cart** or **Submit Cart Order** to submit. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.9",
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
      description: "The `sys_id` of the catalog item to add. Run **Search Catalog Items** first to find this value. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
    },
    quantity: {
      propDefinition: [
        servicenow,
        "quantity",
      ],
    },
    variables: {
      propDefinition: [
        servicenow,
        "variables",
      ],
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
    },
    itemGuid: {
      propDefinition: [
        servicenow,
        "itemGuid",
      ],
    },
  },
  async run({ $ }) {
    const itemGuid = String(this.itemGuid ?? "").trim();
    if (itemGuid && !SYS_ID_PATTERN.test(itemGuid)) {
      throw new ConfigurationError("Reserved Item GUID must be a 32-character hexadecimal sys_id.");
    }
    const response = await this.servicenow.addItemToCart({
      $,
      catalogItemSysId: this.catalogItemSysId,
      data: {
        sysparm_quantity: this.quantity,
        variables: parseObject(this.variables),
        sysparm_requested_for: this.requestedFor,
        ...(itemGuid && {
          sysparm_item_guid: itemGuid,
        }),
      },
    });

    let matching = catalogCartItems(response).filter(
      (item) => !item.catalogItemId || item.catalogItemId === this.catalogItemSysId,
    );
    if (!matching.length || itemGuid) {
      const cart = await this.servicenow.getCart({
        $,
      });
      matching = catalogCartItems(cart).filter(
        (item) => !item.catalogItemId || item.catalogItemId === this.catalogItemSysId,
      );
    }
    const cartItemId = itemGuid
      ? matching.find((item) => item.cartItemId === itemGuid)?.cartItemId
      : matching.at(-1)?.cartItemId;
    if (itemGuid && cartItemId !== itemGuid) {
      throw new ConfigurationError(
        "ServiceNow did not honor the reserved item GUID; staged attachments were not submitted.",
      );
    }

    $.export(
      "$summary",
      `Successfully added catalog item ${this.catalogItemSysId} to cart${cartItemId
        ? ` as ${cartItemId}`
        : ""}`,
    );

    return enrichedResponse(response, cartItemId);
  },
};
