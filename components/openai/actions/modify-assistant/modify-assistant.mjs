import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";

export default {
  ...common,
  key: "openai-modify-assistant",
  name: "Modify an Assistant",
  description: "Modifies an existing OpenAI assistant. [See the documentation](https://platform.openai.com/docs/api-reference/assistants/modifyAssistant)",
  version: "0.1.7",
  type: "action",
  props: {
    openai,
    assistant: {
      propDefinition: [
        openai,
        "assistant",
      ],
    },
    model: {
      propDefinition: [
        openai,
        "assistantModel",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        openai,
        "name",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        openai,
        "description",
      ],
      optional: true,
    },
    instructions: {
      propDefinition: [
        openai,
        "instructions",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
      optional: true,
    },
    ...common.props,
  },
  async run({ $ }) {
    const response = await this.openai.modifyAssistant({
      $,
      assistant: this.assistant,
      data: {
        model: this.model,
        name: this.name,
        description: this.description,
        instructions: this.instructions,
        tools: this.buildTools(),
        tool_resources: this.buildToolResources(),
        metadata: this.metadata,
      },
    });
    $.export("$summary", `Successfully modified assistant ${this.assistant}`);
    return response;
  },
};
