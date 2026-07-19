import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-empty-cart",
  name: "Empty Cart",
  description: "Empty and delete the current user's ServiceNow cart, removing all of its items. The action resolves the active cart automatically, so no cart ID is required. Emptying a cart that still has items requires the `catalog_admin` role (a plain `admin` can only delete an already-empty cart). [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    servicenow,
  },
  async run({ $ }) {
    const { cart_id: cartSysId } = await this.servicenow.getCart({
      $,
    });

    const response = await this.servicenow.emptyCart({
      $,
      cartSysId,
    });

    $.export("$summary", `Successfully emptied cart ${cartSysId}`);

    return response;
  },
};
