import littleGreenLight from "../../little_green_light.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "little_green_light-update-constituent",
  name: "Update Constituent",
  description: "Updates a constituent along with related objects in Little Green Light. [See the documentation](https://api.littlegreenlight.com/api-docs/static.html)",
  version: "0.0.1",
  type: "action",
  props: {
    littleGreenLight,
    constituentId: {
      propDefinition: [
        littleGreenLight,
        "constituentId",
      ],
    },
    lastName: {
      propDefinition: [
        littleGreenLight,
        "lastName",
      ],
    },
    giftTypeId: {
      propDefinition: [
        littleGreenLight,
        "giftTypeId",
      ],
    },
    giftTypeName: {
      propDefinition: [
        littleGreenLight,
        "giftTypeName",
      ],
    },
    clientKey: {
      propDefinition: [
        littleGreenLight,
        "clientKey",
      ],
    },
  },
  async run({ $ }) {
    const updateConstituentResponse = await this.littleGreenLight.updateConstituent({
      constituentId: this.constituentId,
      lastName: this.lastName,
    });

    let createGiftResponse = null;
    if (this.giftTypeId && this.giftTypeName) {
      createGiftResponse = await this.littleGreenLight.createGift({
        constituentId: this.constituentId,
        giftTypeId: this.giftTypeId,
        giftTypeName: this.giftTypeName,
      });
    }

    $.export("$summary", `Successfully updated constituent with ID ${this.constituentId}. ${createGiftResponse
      ? "Added a new gift."
      : ""}`);
    return {
      updateConstituentResponse,
      createGiftResponse,
    };
  },
};
