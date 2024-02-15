import littlegreenlight from "../../little_green_light.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "little_green_light-add-gift",
  name: "Add Gift",
  description: "Adds a new gift to a constituent in Little Green Light.",
  version: "0.0.1",
  type: "action",
  props: {
    littlegreenlight,
    constituentId: {
      propDefinition: [
        littlegreenlight,
        "constituentId",
      ],
    },
    giftTypeId: {
      propDefinition: [
        littlegreenlight,
        "giftTypeId",
      ],
    },
    giftTypeName: {
      propDefinition: [
        littlegreenlight,
        "giftTypeName",
      ],
    },
    clientKey: {
      propDefinition: [
        littlegreenlight,
        "clientKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.littlegreenlight.createGift({
      constituentId: this.constituentId,
      giftTypeId: this.giftTypeId,
      giftTypeName: this.giftTypeName,
      clientKey: this.clientKey,
    });

    $.export("$summary", `Successfully added gift to constituent ${this.constituentId}`);
    return response;
  },
};
