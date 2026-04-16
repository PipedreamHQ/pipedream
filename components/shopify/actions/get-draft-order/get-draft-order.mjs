import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-draft-order",
  name: "Get Draft Order",
  description: "Retrieve a single draft order by ID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/draftorder)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has customer data properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    draftOrderId: {
      propDefinition: [
        shopify,
        "draftOrderId",
      ],
    },
  },
  async run({ $ }) {
    const { draftOrder } = await this.shopify.getDraftOrder({
      id: this.draftOrderId,
    });
    $.export("$summary", `Successfully retrieved draft order \`${draftOrder.name || draftOrder.id}\``);
    return draftOrder;
  },
};
