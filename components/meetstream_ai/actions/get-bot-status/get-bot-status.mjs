import meetstream_ai from "../../meetstream_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "meetstream_ai-get-bot-status",
  name: "Get Bot Status",
  description: "Retrieves the current status of a specific bot. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    meetstream_ai,
    botId: {
      propDefinition: [
        meetstream_ai,
        "botId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.meetstream_ai.getBotStatus({
      botId: this.botId,
    });
    $.export("$summary", `Successfully retrieved status for Bot ID ${this.botId}`);
    return response;
  },
};
