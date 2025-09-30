import zep from "../../zep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zep-add-memory",
  name: "Add Memory to Session",
  description: "Adds memory to an existing session in Zep. [See the documentation](https://help.getzep.com/api-reference/memory/add)",
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
      propDefinition: [
        zep,
        "sessionId",
      ],
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "An array of message objects, where each message contains a role (`norole`, `system`, `assistant`, `user`, `function`, or `tool`) and content. Example: `[{ \"content\": \"content\", \"role_type\": \"norole\" }]` [See the documentation](https://help.getzep.com/api-reference/memory/add) for more information",
    },
    factInstruction: {
      type: "string",
      label: "Fact Instruction",
      description: "Additional instruction for generating the facts",
      optional: true,
    },
    returnContext: {
      type: "boolean",
      label: "Return Context",
      description: "Optionally return memory context relevant to the most recent messages",
      optional: true,
    },
    summaryInstruction: {
      type: "string",
      label: "Summary Instructions",
      description: "Additional instruction for generating the summary",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zep.addMemoryToSession({
      sessionId: this.sessionId,
      data: {
        messages: utils.parseArray(this.messages),
        factInstruction: this.factInstruction,
        returnContext: this.returnContext,
        summaryInstruction: this.summaryInstruction,
      },
    });
    $.export("$summary", `Added memory to session ${this.sessionId}`);
    return response;
  },
};
