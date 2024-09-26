import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";

export default {
  ...common,
  key: "openai-create-assistant",
  name: "Create Assistant",
  description: "Creates an assistant with a model and instructions. [See the documentation](https://platform.openai.com/docs/api-reference/assistants/createAssistant)",
  version: "0.1.7",
  type: "action",
  props: {
    openai,
    model: {
      propDefinition: [
        openai,
        "assistantModel",
      ],
    },
    name: {
      propDefinition: [
        openai,
        "name",
      ],
    },
    description: {
      propDefinition: [
        openai,
        "description",
      ],
    },
    instructions: {
      propDefinition: [
        openai,
        "instructions",
      ],
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
    ...common.props,
  },
  async run({ $ }) {
    const response = await this.openai.createAssistant({
      $,
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

    $.export("$summary", `Successfully created an assistant with ID: ${response.id}`);
    return response;
  },
};
