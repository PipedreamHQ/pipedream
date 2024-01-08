import referrizer from "../../referrizer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "referrizer-create-loyalty-reward",
  name: "Create Loyalty Reward",
  description: "Adds a new loyalty reward to the Referrizer system. [See the documentation](https://api.referrizer.com/static/docs/index.html#loyalty-rewards-create-a-loyalty-reward)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    referrizer,
    title: {
      propDefinition: [
        referrizer,
        "title",
      ],
    },
    points: {
      propDefinition: [
        referrizer,
        "points",
      ],
    },
    quantityTotal: {
      propDefinition: [
        referrizer,
        "quantityTotal",
      ],
    },
    quantityPerContact: {
      propDefinition: [
        referrizer,
        "quantityPerContact",
      ],
    },
    startDate: {
      propDefinition: [
        referrizer,
        "startDate",
      ],
    },
    expiredDate: {
      propDefinition: [
        referrizer,
        "expiredDate",
      ],
    },
    expires: {
      propDefinition: [
        referrizer,
        "expires",
      ],
    },
    type: {
      propDefinition: [
        referrizer,
        "type",
      ],
    },
    value: {
      propDefinition: [
        referrizer,
        "value",
      ],
    },
    itemId: {
      propDefinition: [
        referrizer,
        "itemId",
        (c) => ({
          optional: true,
        }),
      ],
    },
    itemName: {
      propDefinition: [
        referrizer,
        "itemName",
        (c) => ({
          optional: true,
        }),
      ],
    },
    pin: {
      propDefinition: [
        referrizer,
        "pin",
        (c) => ({
          optional: true,
        }),
      ],
    },
    note: {
      propDefinition: [
        referrizer,
        "note",
        (c) => ({
          optional: true,
        }),
      ],
    },
    invitationMessage: {
      propDefinition: [
        referrizer,
        "invitationMessage",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.referrizer.createLoyaltyReward({
      title: this.title,
      points: this.points,
      quantityTotal: this.quantityTotal,
      quantityPerContact: this.quantityPerContact,
      startDate: this.startDate,
      expiredDate: this.expiredDate,
      expires: this.expires,
      type: this.type,
      value: this.value,
      itemId: this.itemId,
      itemName: this.itemName,
      // The following fields are optional and may not be provided
      ...(this.pin && {
        pin: this.pin,
      }),
      ...(this.note && {
        note: this.note,
      }),
      ...(this.invitationMessage && {
        invitationMessage: this.invitationMessage,
      }),
    });

    $.export("$summary", `Successfully created loyalty reward with title: ${this.title}`);
    return response;
  },
};
