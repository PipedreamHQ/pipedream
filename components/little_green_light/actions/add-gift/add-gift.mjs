import littlegreenlight from "../../little_green_light.app.mjs";

export default {
  key: "little_green_light-add-gift",
  name: "Add Gift",
  description: "Adds a new gift to a constituent in Little Green Light. [See the documentation](https://api.littlegreenlight.com/api-docs/static.html#create_new_gift)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    littlegreenlight,
    constituentId: {
      propDefinition: [
        littlegreenlight,
        "constituentId",
      ],
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "The external identifier to the new gift.",
      optional: true,
    },
    isAnon: {
      type: "boolean",
      label: "Is Anon",
      description: "Gift is anonymous?",
      optional: true,
    },
    giftTypeId: {
      propDefinition: [
        littlegreenlight,
        "giftTypeId",
      ],
      optional: true,
    },
    giftCategoryId: {
      propDefinition: [
        littlegreenlight,
        "giftCategoryId",
      ],
      optional: true,
    },
    fundId: {
      propDefinition: [
        littlegreenlight,
        "fundId",
      ],
      optional: true,
    },
    appealId: {
      propDefinition: [
        littlegreenlight,
        "appealId",
      ],
      optional: true,
    },
    receivedAmount: {
      type: "string",
      label: "Received Amount",
      description: "The amount of the gift in cents.",
      optional: true,
    },
    receivedDate: {
      type: "string",
      label: "Received Date",
      description: "The date of the gift. Format `YYYY-MM-DD`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.littlegreenlight.createGift({
      $,
      constituentId: this.constituentId,
      data: {
        external_id: this.externalId,
        is_anon: this.isAnon,
        gift_type_id: this.giftTypeId,
        gift_category_id: this.giftCategoryId,
        fund_id: this.fundId,
        appeal_id: this.appealId,
        received_amount: this.receivedAmount && (this.receivedAmount / 100).toFixed(2),
        received_date: this.receivedDate,
      },
    });

    $.export("$summary", `Successfully added gift with Id: ${response.id}`);
    return response;
  },
};
