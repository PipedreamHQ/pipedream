import { parseObject } from "../../common/utils.mjs";
import fidelApi from "../../fidel_api.app.mjs";

export default {
  key: "fidel_api-link-card",
  name: "Link Card",
  description: "Links a new card to the Fidel API for monitoring transactions. [See the documentation](https://reference.fidel.uk/reference#create-a-card)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    try {
      response = await this.fidelApi.createCard({
        programId: this.programId,
        data: {
          countryCode: this.countryCode,
          expMonth: this.expMonth,
          expYear: this.expYear,
          number: this.number,
          termsOfUse: this.termsOfUse,
          metadata: parseObject(this.metadata),
        },
      });
    } catch ({ response: { data: { error } } }) {
      throw new Error(error.message || error.code);
    }

    $.export("$summary", `Successfully linked card with ID ${response.items[0]?.id}`);
    return response;
  },
};
