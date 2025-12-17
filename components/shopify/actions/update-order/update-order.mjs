import shopify from "../../shopify.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shopify-update-order",
  name: "Update Order",
  description: "Update an existing order. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/orderupdate)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has orders properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address associated with the order",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "An optional note to attach to the order",
      optional: true,
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
      optional: true,
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
  },
  async run({ $ }) {
    const input = {
      id: this.orderId,
    };

    if (this.email) {
      input.email = this.email;
    }
    if (this.note) {
      input.note = this.note;
    }
    if (this.tags) {
      input.tags = this.tags;
    }
    if (this.metafields) {
      input.metafields = utils.parseJson(this.metafields);
    }

    const response = await this.shopify.updateOrder({
      input,
    });

    if (response.orderUpdate.userErrors.length > 0) {
      throw new Error(response.orderUpdate.userErrors[0].message);
    }

    $.export("$summary", `Successfully updated order \`${response.orderUpdate.order.name}\``);
    return response;
  },
};
