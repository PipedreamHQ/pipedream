import { parseToolsArray } from "../../common/helpers.mjs";
import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-assistant",
  name: "Create Assistant",
  description: "Creates an assistant with a model and instructions. [See the documentation](https://platform.openai.com/docs/api-reference/assistants/createAssistant)",
  version: "0.1.4",
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
    fileIds: {
      propDefinition: [
        openai,
        "fileId",
      ],
      type: "string[]",
      label: "File IDs",
      description: "List of file IDs to attach to the message",
      optional: true,
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
      file_ids: this.fileIds,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created an assistant with ID: ${response.id}`);
    return response;
  },
};
