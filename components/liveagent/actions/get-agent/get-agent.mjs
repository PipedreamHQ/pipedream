import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-get-agent",
  name: "Get Agent",
  description: "Retrieves agent info and auth token. [See the documentation](https://support.liveagent.com/911737-API-v3)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    liveagent,
    agentId: {
      propDefinition: [
        liveagent,
        "agentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.liveagent.getAgent({
      agentId: this.agentId,
      $,
    });
    $.export("$summary", `Successfully retrieved agent: ${response.name}`);
    return response;
  },
};
