import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-gift-card",
  name: "Create Gift Card",
  description: "Creates a new gift card. To supply an optional customer, run **Get Customers** first to retrieve the customer GID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/giftCardCreate).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    shopify,
    initialValue: {
      type: "string",
      label: "Initial Value",
      description: "The initial monetary value of the gift card as a decimal string (e.g. `1000.00`), in the store's currency.",
    },
    code: {
      type: "string",
      label: "Code",
      description: "Custom gift card code, 8-20 alphanumeric characters. If omitted, Shopify generates one automatically.",
      optional: true,
    },
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Internal note about the gift card (e.g. `Birthday gift card`).",
      optional: true,
    },
    expiresOn: {
      type: "string",
      label: "Expires On",
      description: "Expiration date in `YYYY-MM-DD` format (e.g. `2026-12-31`).",
      optional: true,
    },
    templateSuffix: {
      type: "string",
      label: "Template Suffix",
      description: "Liquid template suffix used to render the gift card.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.createGiftCard({
      input: {
        initialValue: this.initialValue,
        code: this.code,
        customerId: this.customerId,
        note: this.note,
        expiresOn: this.expiresOn,
        templateSuffix: this.templateSuffix,
      },
    });

    if (response.giftCardCreate?.userErrors?.length > 0) {
      throw new Error(response.giftCardCreate.userErrors.map(({ message }) => message).join(", "));
    }

    const { giftCard } = response.giftCardCreate ?? {};
    $.export("$summary", `Created gift card with id \`${giftCard?.id}\``);
    return response;
  },
};
