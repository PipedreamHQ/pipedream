import fidelApi from "../../fidel_api.app.mjs";

export default {
  key: "fidel_api-delete-card",
  name: "Delete Card",
  description: "Allows for the removal of a previously linked card from the Fidel API. [See the documentation](https://reference.fidel.uk/reference/delete-card)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fidelApi,
    programId: {
      propDefinition: [
        fidelApi,
        "programId",
      ],
    },
    cardId: {
      propDefinition: [
        fidelApi,
        "cardId",
        ({ programId }) => ({
          programId,
        }),
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
