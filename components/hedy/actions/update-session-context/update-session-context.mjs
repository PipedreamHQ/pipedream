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
      propDefinition: [
        app,
        "title",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    isDefault: {
      propDefinition: [
        app,
        "isDefault",
      ],
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
