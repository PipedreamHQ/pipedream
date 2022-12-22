import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-create-deal",
  name: "Create Deal",
  version: "0.0.1",
  description: "Create a new deal. [See the docs here](https://developers.teamgate.com/#7cf909d7-b66c-4ddb-ac3b-bb800f8b4ae5)",
  type: "action",
  props: {
    teamgate,
    name: {
      propDefinition: [
        teamgate,
        "name",
      ],
      description: "Name of the Deal. E.g. `\"Example Ltd\"`.",
    },
    buyerType: {
      type: "string",
      label: "Buyer Type",
      description: "The type of entity that will interact.",
      options: [
        "company",
        "person",
      ],
      reloadProps: true,
    },
    buyerId: {
      propDefinition: [
        teamgate,
        "buyerId",
        (c) => ({
          buyerType: c.buyerType,
        }),
      ],
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
      type: "string",
      label: "Cart Discount Value",
      description: "The discount on all cart.",
      optional: true,
    },
    cartDiscountType: {
      type: "string",
      label: "Cart Discount Type",
      description: "The type of the discount.",
      optional: true,
      options: [
        "fixed",
        "perc",
      ],
    },
    cartItems: {
      type: "string[]",
      label: "Cart Items",
      description: "The object items. Example: `{\"id\":20,\"price\":{\"currency\": \"EUR\",\"value\": \"10000.0000\"},\"discount\":{\"type\":\"percentage\",\"value\": \"20.0000\"},\"quantity\": 2}`",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Deal`s status",
      optional: true,
      options: [
        "active",
        "won",
        "lost",
        "postponed",
      ],
    },
    priceValue: {
      type: "string",
      label: "Price Value",
      description: "The deal`s price",
      optional: true,
    },
    priceCurrency: {
      type: "string",
      label: "Price Currency",
      description: "The deal`s currency",
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
      type: "string",
      label: "Estimated Closure Date",
      description: "Example: `2017-03-10T11:45:59+02:00`",
      optional: true,
    },
    actualClosureDate: {
      type: "string",
      label: "Actual Closure Date",
      description: "Example: `2017-03-10T11:45:59+02:00`",
      optional: true,
    },
    createdDate: {
      type: "string",
      label: "Created Date",
      description: "Example: `2017-03-10T11:45:59+02:00`",
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
      name,
      buyerType,
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
      buyerType,
      buyerId,
      stage,
      cart: {
        discount: {
          "value": cartDiscountValue,
          "type": cartDiscountType,
        },
        items: cartItems.map((item) => (JSON.parse(item))),
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

    const response = await this.teamgate.createDeal({
      $,
      data,
    });

    $.export("$summary", "Deal Successfully created!");
    return response;
  },
};
