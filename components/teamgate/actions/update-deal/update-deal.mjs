import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-update-deal",
  name: "Update Deal",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific deal. [See the docs here](https://developers.teamgate.com/#fe590427-fcb9-4689-9671-7d3daa235b1a)",
  type: "action",
  props: {
    teamgate,
    dealId: {
      propDefinition: [
        teamgate,
        "deals",
      ],
      type: "integer",
      label: "Deal Id",
      description: "The deal id which will be updated",
    },
    name: {
      propDefinition: [
        teamgate,
        "name",
      ],
      description: "Name of the Deal. E.g. `\"Example Ltd\"`.",
    },
    buyerId: {
      propDefinition: [
        teamgate,
        "personId",
      ],
      label: "Buyer Id",
    },
    pipeline: {
      propDefinition: [
        teamgate,
        "pipeline",
      ],
    },
    stage: {
      propDefinition: [
        teamgate,
        "stage",
        (c) => ({
          pipeline: c.pipeline,
        }),
      ],
    },
    cartDiscountValue: {
      propDefinition: [
        teamgate,
        "cartDiscountValue",
      ],
      optional: true,
    },
    cartDiscountType: {
      propDefinition: [
        teamgate,
        "cartDiscountType",
      ],
      optional: true,
    },
    cartItems: {
      propDefinition: [
        teamgate,
        "cartItems",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        teamgate,
        "status",
      ],
      optional: true,
    },
    priceValue: {
      propDefinition: [
        teamgate,
        "priceValue",
      ],
      optional: true,
    },
    priceCurrency: {
      propDefinition: [
        teamgate,
        "priceCurrency",
      ],
      optional: true,
    },
    starred: {
      propDefinition: [
        teamgate,
        "starred",
      ],
      description: "Indicator the deal is starred or not.",
      optional: true,
    },
    ownerId: {
      propDefinition: [
        teamgate,
        "ownerId",
      ],
      optional: true,
    },
    ownerUsername: {
      propDefinition: [
        teamgate,
        "ownerUsername",
      ],
      optional: true,
      description: "The username to which the deal belongs.",
    },
    ownerRandom: {
      propDefinition: [
        teamgate,
        "ownerRandom",
      ],
      optional: true,
    },
    sourceId: {
      propDefinition: [
        teamgate,
        "sourceId",
      ],
      optional: true,
    },
    source: {
      propDefinition: [
        teamgate,
        "source",
      ],
      optional: true,
    },
    sourceDescription: {
      propDefinition: [
        teamgate,
        "sourceDescription",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        teamgate,
        "tags",
      ],
      optional: true,
    },
    estimatedClosureDate: {
      propDefinition: [
        teamgate,
        "estimatedClosureDate",
      ],
      optional: true,
    },
    actualClosureDate: {
      propDefinition: [
        teamgate,
        "actualClosureDate",
      ],
      optional: true,
    },
    createdDate: {
      propDefinition: [
        teamgate,
        "createdDate",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        teamgate,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      dealId,
      name,
      buyerId,
      stage,
      cartDiscountValue,
      cartDiscountType,
      cartItems,
      status,
      priceValue,
      priceCurrency,
      starred,
      ownerId,
      ownerUsername,
      ownerRandom,
      sourceId,
      source,
      sourceDescription,
      tags,
      estimatedClosureDate,
      actualClosureDate,
      createdDate,
      customFields,
    } = this;

    const data = {
      name,
      buyerId,
      stage,
      cart: {
        discount: {
          "value": cartDiscountValue,
          "type": cartDiscountType,
        },
        items: cartItems && cartItems.map((item) => (JSON.parse(item))),
      },
      status,
      priceValue,
      priceCurrency,
      starred,
      ownerId,
      ownerUsername,
      ownerRandom,
      sourceId,
      source,
      sourceDescription,
      tags,
      estimatedClosureDate,
      actualClosureDate,
      createdDate,
      customFields,
    };

    const response = await this.teamgate.updateDeal({
      $,
      dealId,
      data,
    });

    $.export("$summary", "Deal Successfully updated!");
    return response;
  },
};
