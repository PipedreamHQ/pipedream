import { parseToolsArray } from "../../common/helpers.mjs";
import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-assistant",
  name: "Create Assistant",
  description: "Creates an assistant with a model and instructions. [See the docs here](https://platform.openai.com/docs/api-reference/assistants/createAssistant)",
  version: "0.1.0",
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
    tools: {
      propDefinition: [
        openai,
        "tools",
      ],
    },
    file_ids: {
      propDefinition: [
        openai,
        "file_ids",
      ],
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.createAssistant({
      $,
      model: this.model,
      name: this.name,
      description: this.description,
      instructions: this.instructions,
      tools: parseToolsArray(this.tools),
      file_ids: this.file_ids,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created an assistant with ID: ${response.id}`);
    return response;
  },
};
