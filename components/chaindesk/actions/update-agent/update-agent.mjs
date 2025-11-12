import chaindesk from "../../chaindesk.app.mjs";

export default {
  key: "chaindesk-update-agent",
  name: "Update Agent",
  description: "Updates the agent to improve the accuracy of generated responses.",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chaindesk,
    agentId: {
      propDefinition: [
        chaindesk,
        "agentId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name to update the agent.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description to update the agent with to improve the accuracy of generated responses.",
      optional: true,
    },
    modelName: {
      type: "string",
      label: "Model Name",
      description: "The GPT model the agent will use.",
      options: [
        "gpt_3_5_turbo",
        "gpt_3_5_turbo_16k",
        "gpt_4",
        "gpt_4_32k",
      ],
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the agent.",
      options: [
        "public",
        "private",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chaindesk.updateAgent({
      $,
      agentId: this.agentId,
      data: {
        name: this.name,
        description: this.description,
        modelName: this.modelName,
        visibility: this.visibility,
      },
    });
    $.export("$summary", `Successfully updated the agent with ID ${this.agentId}`);
    return response;
  },
};
