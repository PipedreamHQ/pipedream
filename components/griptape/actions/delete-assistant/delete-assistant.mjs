import app from "../../griptape.app.mjs";

export default {
  key: "griptape-delete-assistant",
  name: "Delete Assistant",
  description: "Deletes an existing assistant. [See the documentation](https://docs.griptape.ai/stable/griptape-cloud/api/api-reference/#/Assistants/DeleteAssistant).",
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
  },
  methods: {
    deleteAssistant({
      assistantId, ...args
    } = {}) {
      return this.app.delete({
        path: `/assistants/${assistantId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteAssistant,
      assistantId,
    } = this;

    await deleteAssistant({
      $,
      assistantId,
    });
    $.export("$summary", "Successfully deleted assistant");
    return {
      success: true,
    };
  },
};
