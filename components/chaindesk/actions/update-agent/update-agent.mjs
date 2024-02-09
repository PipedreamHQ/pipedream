import chaindesk from "../../chaindesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chaindesk-update-agent",
  name: "Update Agent",
  description: "Updates the agent to improve the accuracy of generated responses.",
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
    description: {
      propDefinition: [
        chaindesk,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chaindesk.updateAgent({
      agentId: this.agentId,
      description: this.description,
    });
    $.export("$summary", `Successfully updated the agent with ID ${this.agentId}`);
    return response;
  },
};
