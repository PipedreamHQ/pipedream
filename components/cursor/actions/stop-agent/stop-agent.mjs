import cursor from "../../cursor.app.mjs";

export default {
  key: "cursor-stop-agent",
  name: "Stop Agent",
  description: "Stop a running agent. You can only stop agents that are currently running. [See the documentation](https://cursor.com/docs/cloud-agent/api/endpoints#stop-an-agent)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cursor,
    agentId: {
      propDefinition: [
        cursor,
        "agentId",
        () => ({
          status: "RUNNING",
        }),
      ],
      description: "The ID of an agent that is currently running",
    },
  },
  async run({ $ }) {
    const response = await this.cursor.stopAgent({
      $,
      agentId: this.agentId,
    });
    $.export("$summary", `Successfully stopped agent ${this.agentId}`);
    return response;
  },
};
