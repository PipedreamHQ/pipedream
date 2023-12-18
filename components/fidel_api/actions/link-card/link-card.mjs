import fidelApi from "../../fidel_api.app.mjs";

export default {
  key: "fidel_api-link-card",
  name: "Link a New Card",
  description: "Links a new card to the Fidel API for monitoring transactions. [See the documentation](https://reference.fidel.uk/reference#create-a-card)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fidelApi,
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
        (c) => ({
          optional: true,
        }), // Making metadata optional as per the app file
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fidelApi.createCard({
      programId: this.programId,
      countryCode: this.countryCode,
      expMonth: this.expMonth,
      expYear: this.expYear,
      number: this.number,
      termsOfUse: this.termsOfUse,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully linked card with ID ${response.id}`);
    return response;
  },
};
