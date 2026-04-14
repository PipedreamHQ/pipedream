import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-agent",
  name: "Get Agent",
  description: "Retrieve a single agent by their ID. [See the documentation](https://developers.freshdesk.com/api/#view_agent)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    agentId: {
      propDefinition: [
        freshdesk,
        "agentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.getAgent({
      agentId: this.agentId,
      $,
    });
    $.export("$summary", `Successfully retrieved agent: ${response.contact?.name || response.id}`);
    return response;
  },
};
