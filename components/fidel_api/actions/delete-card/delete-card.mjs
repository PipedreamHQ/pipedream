import fidelApi from "../../fidel_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fidel_api-delete-card",
  name: "Delete a Card",
  description: "Allows for the removal of a previously linked card from the Fidel API. [See the documentation](https://reference.fidel.uk/reference/delete-card)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fidelApi,
    cardId: {
      propDefinition: [
        fidelApi,
        "cardId",
      ],
    },
    // Additional props from app file
    programId: {
      propDefinition: [
        fidelApi,
        "programId",
      ],
    },
    countryCode: {
      propDefinition: [
        fidelApi,
        "countryCode",
      ],
    },
    expMonth: {
      propDefinition: [
        fidelApi,
        "expMonth",
      ],
    },
    expYear: {
      propDefinition: [
        fidelApi,
        "expYear",
      ],
    },
    number: {
      propDefinition: [
        fidelApi,
        "number",
      ],
    },
    termsOfUse: {
      propDefinition: [
        fidelApi,
        "termsOfUse",
      ],
    },
    metadata: {
      propDefinition: [
        fidelApi,
        "metadata",
      ],
    },
    url: {
      propDefinition: [
        fidelApi,
        "url",
      ],
    },
    eventName: {
      propDefinition: [
        fidelApi,
        "eventName",
      ],
    },
    offerId: {
      propDefinition: [
        fidelApi,
        "offerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fidelApi.deleteCard({
      cardId: this.cardId,
    });

    $.export("$summary", `Successfully deleted card with ID ${this.cardId}`);
    return response;
  },
};
