import zep from "../../zep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zep-update-session",
  name: "Update Session",
  description: "Updates an existing session in Zep. [See the documentation](https://help.getzep.com/api-reference/memory/update-session)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zep,
    sessionId: {
      propDefinition: [
        zep,
        "sessionId",
      ],
    },
    metadata: {
      propDefinition: [
        zep,
        "metadata",
      ],
      description: "An object of key/value pairs representing the metadata to add to the session",
    },
    factRatingInstructions: {
      propDefinition: [
        zep,
        "factRatingInstructions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zep.updateSession({
      $,
      sessionId: this.sessionId,
      data: {
        fact_rating_instructions: utils.parseObject(this.factRatingInstructions),
        metadata: utils.parseObject(this.metadata),
      },
    });
    $.export("$summary", `Successfully updated ssession with ID ${this.sessionId}`);
    return response;
  },
};
