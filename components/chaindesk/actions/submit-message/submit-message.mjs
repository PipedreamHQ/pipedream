import chaindesk from "../../chaindesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chaindesk-submit-message",
  name: "Submit Message",
  description: "Allows the API to send a message input from the user.",
  version: "0.0.1",
  type: "action",
  props: {
    chaindesk,
    agentId: {
      propDefinition: [
        chaindesk,
        "agentId",
      ],
    },
    query: {
      propDefinition: [
        chaindesk,
        "query",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chaindesk.sendMessage({
      agentId: this.agentId,
      query: this.query,
    });

    $.export("$summary", `Message successfully submitted to agent ID ${this.agentId}`);
    return response;
  },
};
