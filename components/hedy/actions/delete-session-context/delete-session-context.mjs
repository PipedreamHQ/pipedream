import app from "../../hedy.app.mjs";

export default {
  key: "hedy-delete-session-context",
  name: "Delete Session Context",
  description: "Deletes a Hedy session context. This action is irreversible."
    + " If you delete the current default context, the most recently created remaining context is automatically promoted to default."
    + " Use **Get Many Session Contexts** to find the context ID before deleting."
    + " [See the documentation](https://www.hedy.ai/help/hedy-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contextId: {
      propDefinition: [
        app,
        "contextId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteContext({
      $,
      contextId: this.contextId,
    });
    $.export("$summary", `Deleted session context ${this.contextId}`);
    return response;
  },
};
