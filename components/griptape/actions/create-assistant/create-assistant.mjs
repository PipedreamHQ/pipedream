import app from "../../griptape.app.mjs";

export default {
  key: "griptape-create-assistant",
  name: "Create Assistant",
  description: "Creates a new assistant in Griptape. [See the documentation](https://docs.griptape.ai/stable/griptape-cloud/api/api-reference/#/Assistants/CreateAssistant)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
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
    createAssistant(args = {}) {
      return this.app.post({
        path: "/assistants",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createAssistant,
      name,
      description,
      input,
      knowledgeBaseIds,
      rulesetIds,
      structureIds,
      toolIds,
    } = this;

    const response = await createAssistant({
      $,
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
    $.export("$summary", `Successfully created a new assistant with ID \`${response.assistant_id}\`.`);
    return response;
  },
};
