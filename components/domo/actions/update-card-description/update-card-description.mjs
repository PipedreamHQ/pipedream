import domo from "../../domo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "domo-update-card-description",
  name: "Update Card Description",
  description: "Updates the description of an existing card in Domo. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    domo,
    updateCardId: {
      propDefinition: [
        domo,
        "updateCardId",
      ],
    },
    newDescription: {
      propDefinition: [
        domo,
        "newDescription",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.domo.updateCardDescription({
      cardId: this.updateCardId,
      newDescription: this.newDescription,
    });
    $.export("$summary", `Successfully updated description for card ID ${this.updateCardId}`);
    return response;
  },
};
