import zep from "../../zep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zep-create-session",
  name: "Create Session",
  description: "Creates a new session in Zep. [See the documentation](https://help.getzep.com/api-reference/memory/add-session)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zep,
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The unique identifier of the session",
    },
    userId: {
      propDefinition: [
        zep,
        "userId",
      ],
    },
    factRatingInstructions: {
      propDefinition: [
        zep,
        "factRatingInstructions",
      ],
    },
    metadata: {
      propDefinition: [
        zep,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zep.createSession({
      $,
      data: {
        session_id: this.sessionId,
        user_id: this.userId,
        fact_rating_instructions: utils.parseObject(this.factRatingInstructions),
        metadata: utils.parseObject(this.metadata),
      },
    });
    $.export("$summary", `Created session with ID ${this.sessionId}`);
    return response;
  },
};
