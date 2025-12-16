import cursor from "../../cursor.app.mjs";

export default {
  key: "cursor-get-agent-status",
  name: "Get Agent Status",
  description: "Gets the status of an agent. [See the documentation](https://cursor.com/docs/cloud-agent/api/endpoints#agent-status)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cursor,
    agentId: {
      propDefinition: [
        cursor,
        "agentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cursor.getAgentStatus({
      $,
      agentId: this.agentId,
    });
    $.export("$summary", `Successfully retrieved status for agent ${this.agentId}`);
    return response;
  },
};
