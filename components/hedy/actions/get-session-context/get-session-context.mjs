import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-session-context",
  name: "Get Session Context",
  description: "Retrieves full details for a single reusable Hedy session context by ID, including the title, content, and whether it is the default context."
    + " Session contexts are reusable custom AI instruction sets that guide Hedy's analysis across multiple meetings."
    + " Use **Get Many Session Contexts** first to list available contexts and obtain a context ID."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Session%20Contexts/get_contexts__contextId_)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.getContext({
      $,
      contextId: this.contextId,
    });
    const context = response?.data || response;
    $.export("$summary", `Retrieved session context: ${context?.title || this.contextId}`);
    return response;
  },
};
