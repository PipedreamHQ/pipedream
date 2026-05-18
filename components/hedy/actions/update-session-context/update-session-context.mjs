import app from "../../hedy.app.mjs";

export default {
  key: "hedy-update-session-context",
  name: "Update Session Context",
  description: "Updates an existing Hedy session context. All fields are optional — only the fields you provide will be changed."
    + " If you set `isDefault` to `true`, this context becomes the default and the previous default is demoted."
    + " Use **Get Many Session Contexts** to find the context ID."
    + " [See the documentation](https://www.hedy.ai/help/hedy-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    title: {
      type: "string",
      label: "Title",
      description: "New context title (maximum 200 characters).",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "New custom AI instruction text (maximum 20,000 characters).",
      optional: true,
    },
    isDefault: {
      type: "boolean",
      label: "Set as Default",
      description: "Set to `true` to make this the default context for new sessions.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.title !== undefined) data.title = this.title;
    if (this.content !== undefined) data.content = this.content;
    if (this.isDefault !== undefined) data.isDefault = this.isDefault;

    const response = await this.app.updateContext({
      $,
      contextId: this.contextId,
      data,
    });
    const context = response?.data || response;
    $.export("$summary", `Updated session context: ${context?.title || this.contextId}`);
    return response;
  },
};
