import littleGreenLight from "../../little_green_light.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "little_green_light-create-constituent",
  name: "Create Constituent",
  description: "Adds a constituent to an account along with related objects. [See the documentation](https://api.littlegreenlight.com/api-docs/static.html)",
  version: "0.0.1",
  type: "action",
  props: {
    littleGreenLight,
    lastName: littleGreenLight.propDefinitions.lastName,
    giftTypeId: littleGreenLight.propDefinitions.giftTypeId,
    giftTypeName: littleGreenLight.propDefinitions.giftTypeName,
  },
  async run({ $ }) {
    const constituentData = await this.littleGreenLight.addConstituent({
      lastName: this.lastName,
    });

    if (!constituentData || !constituentData.id) {
      throw new Error("Failed to create constituent");
    }

    const giftCreationResponse = await this.littleGreenLight.createGift({
      constituentId: constituentData.id,
      giftTypeId: this.giftTypeId,
      giftTypeName: this.giftTypeName,
    });

    $.export("$summary", `Successfully created constituent with ID ${constituentData.id} and associated gift`);

    return {
      constituentData,
      giftCreationResponse,
    };
  },
};
