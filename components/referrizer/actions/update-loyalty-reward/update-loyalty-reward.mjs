import referrizer from "../../referrizer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "referrizer-update-loyalty-reward",
  name: "Update Loyalty Reward",
  description: "Modify the details or status of an existing loyalty reward in Referrizer. [See the documentation](https://api.referrizer.com/static/docs/index.html#loyalty-rewards-update-a-loyalty-reward)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    referrizer,
    loyaltyRewardId: {
      propDefinition: [
        referrizer,
        "loyaltyRewardId",
      ],
    },
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
        (configuredProps) => ({
          loyaltyRewardId: configuredProps.loyaltyRewardId,
        }),
      ],
      optional: true,
    },
    itemName: {
      propDefinition: [
        referrizer,
        "itemName",
        (configuredProps) => ({
          loyaltyRewardId: configuredProps.loyaltyRewardId,
        }),
      ],
      optional: true,
    },
    pin: {
      propDefinition: [
        referrizer,
        "pin",
        (configuredProps) => ({
          loyaltyRewardId: configuredProps.loyaltyRewardId,
        }),
      ],
      optional: true,
    },
    note: {
      propDefinition: [
        referrizer,
        "note",
        (configuredProps) => ({
          loyaltyRewardId: configuredProps.loyaltyRewardId,
        }),
      ],
      optional: true,
    },
    invitationMessage: {
      propDefinition: [
        referrizer,
        "invitationMessage",
        (configuredProps) => ({
          loyaltyRewardId: configuredProps.loyaltyRewardId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.referrizer.updateLoyaltyReward({
      loyaltyRewardId: this.loyaltyRewardId,
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
      pin: this.pin,
      note: this.note,
      invitationMessage: this.invitationMessage,
    });

    $.export("$summary", `Successfully updated loyalty reward with ID: ${this.loyaltyRewardId}`);
    return response;
  },
};
