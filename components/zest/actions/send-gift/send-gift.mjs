import zest from "../../zest.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zest-send-gift",
  name: "Send Gift",
  description: "Creates a gift within a specified campaign in Zest. [See the documentation](https://gifts.zest.co/admin/integrations/documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zest,
    campaignId: {
      propDefinition: [
        zest,
        "campaignId",
      ],
    },
    giftMessage: {
      propDefinition: [
        zest,
        "giftMessage",
      ],
      optional: true,
    },
    giftType: {
      propDefinition: [
        zest,
        "giftType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zest.createGift({
      campaignId: this.campaignId,
      giftMessage: this.giftMessage,
      giftType: this.giftType,
    });

    $.export("$summary", `Successfully created a gift in campaign ${this.campaignId}`);
    return response;
  },
};
