import { parseToolsArray } from "../../common/helpers.mjs";
import openai from "../../openai.app.mjs";

export default {
  key: "openai-modify-assistant",
  name: "Modify an Assistant",
  description: "Modifies an existing OpenAI assistant. [See the documentation](https://platform.openai.com/docs/api-reference/assistants/modifyAssistant)",
  version: "0.1.1",
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
    tools: {
      propDefinition: [
        openai,
        "tools",
      ],
      optional: true,
    },
    file_ids: {
      propDefinition: [
        openai,
        "file_ids",
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
  },
  async run({ $ }) {
    const response = await this.openai.modifyAssistant({
      $,
      assistant: this.assistant,
      model: this.model,
      name: this.name,
      description: this.description,
      instructions: this.instructions,
      tools: parseToolsArray(this.tools),
      file_ids: this.file_ids,
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully modified assistant ${this.assistant}`);
    return response;
  },
};
