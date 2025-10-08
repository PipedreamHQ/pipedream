import app from "../../griptape.app.mjs";

export default {
  key: "griptape-update-assistant",
  name: "Update Assistant",
  description: "Updates an existing assistant. [See the documentation](https://docs.griptape.ai/stable/griptape-cloud/api/api-reference/#/Assistants/UpdateAssistant).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    assistantId: {
      propDefinition: [
        app,
        "assistantId",
      ],
    },
    name: {
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    input: {
      optional: true,
      propDefinition: [
        app,
        "input",
      ],
    },
    knowledgeBaseIds: {
      type: "string[]",
      label: "Knowledge Base IDs",
      description: "The knowledge base IDs of the assistant",
      optional: true,
      propDefinition: [
        app,
        "knowledgeBaseId",
      ],
    },
    rulesetIds: {
      type: "string[]",
      label: "Ruleset IDs",
      description: "The ruleset IDs of the assistant",
      optional: true,
      propDefinition: [
        app,
        "rulesetId",
      ],
    },
    structureIds: {
      type: "string[]",
      label: "Structure IDs",
      description: "The structure IDs of the assistant",
      optional: true,
      propDefinition: [
        app,
        "structureId",
      ],
    },
    toolIds: {
      type: "string[]",
      label: "Tool IDs",
      description: "The tool IDs of the assistant",
      optional: true,
      propDefinition: [
        app,
        "toolId",
      ],
    },
  },
  methods: {
    updateAssistant({
      assistantId, ...args
    } = {}) {
      return this.app.patch({
        path: `/assistants/${assistantId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateAssistant,
      assistantId,
      name,
      description,
      input,
      knowledgeBaseIds,
      rulesetIds,
      structureIds,
      toolIds,
    } = this;

    const response = await updateAssistant({
      $,
      assistantId,
      data: {
        name,
        description,
        input,
        knowledge_base_ids: knowledgeBaseIds,
        ruleset_ids: rulesetIds,
        structure_ids: structureIds,
        tool_ids: toolIds,
      },
    });
    $.export("$summary", `Successfully updated assistant with ID \`${response.assistant_id}\`.`);
    return response;
  },
};
