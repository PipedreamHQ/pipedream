import moneybird from "../../moneybird.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "moneybird-create-quote",
  name: "Create Quote",
  description: "Create a new quote. [See docs here](https://developer.moneybird.com/api/estimates/#post_estimates)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    moneybird,
    contactId: {
      propDefinition: [
        moneybird,
        "contactId",
      ],
    },
    productId: {
      propDefinition: [
        moneybird,
        "productId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        moneybird,
        "projectId",
      ],
      optional: true,
    },
    price: {
      label: "Price",
      description: "The estimated price . E.g 110,15",
      type: "string",
    },
    amount: {
      label: "Amount",
      description: "The estimated amount",
      type: "string",
    },
    discount: {
      label: "Discount",
      description: "Discount percentage. E.g 15.00",
      type: "string",
      optional: true,
    },
    language: {
      label: "Language",
      description: "The quote language",
      type: "string",
      options: constants.QUOTE_LANGUAGES,
      optional: true,
    },
    currency: {
      label: "Currency",
      description: "The quote currency. E.g. EUR or USD",
      type: "string",
      optional: true,
    },
    reference: {
      label: "reference",
      description: "The quote reference",
      type: "string",
      optional: true,
    },
    pricesAreIncludedTax: {
      label: "Prices Are Included Tax",
      description: "If the prices are included taxes",
      type: "boolean",
      optional: true,
    },
    showTax: {
      label: "Show Tax",
      description: "Show the taxes",
      type: "boolean",
      optional: true,
    },
    description: {
      label: "Description",
      description: "Description",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.moneybird.createQuote({
      $,
      data: {
        estimate: {
          contact_id: this.contactId,
          reference: this.reference,
          language: this.language,
          currency: this.currency,
          prices_are_incl_tax: this.pricesAreIncludedTax,
          show_tax: this.showTax,
          discount: this.discount,
          details_attributes: [
            {
              description: this.description,
              price: this.price,
              amount: this.amount,
              product_id: this.productId,
              project_id: this.projectId,
            },
          ],
        },
      },
    });

    $.export("$summary", "Successfully created quote.");

    return response;
  },
};
