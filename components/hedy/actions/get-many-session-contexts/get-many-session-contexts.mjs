import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-many-session-contexts",
  name: "Get Many Session Contexts",
  description: "Retrieves all reusable Hedy session contexts, including title, content, and which one is set as the default."
    + " Session contexts are custom AI instruction sets that guide Hedy's analysis of meeting recordings."
    + " Use this tool to browse available contexts or to find a context ID to pass to **Get Session Context**, **Update Session Context**, or **Delete Session Context**."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Session%20Contexts/get_contexts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listContexts({
      $,
    });
    const contexts = response?.data || [];
    $.export("$summary", `Retrieved ${contexts.length} session context${contexts.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
