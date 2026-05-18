import app from "../../hedy.app.mjs";

export default {
  key: "hedy-create-session-context",
  name: "Create Session Context",
  description: "Creates a new reusable Hedy session context — a named set of custom AI instructions that can be applied to meeting recordings to guide analysis."
    + " Free accounts are limited to 1 context; Pro accounts can create multiple."
    + " Set `isDefault` to `true` to make this context automatically applied to new sessions."
    + " Use **Update Session Context** to modify an existing context, or **Delete Session Context** to remove one."
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
    title: {
      type: "string",
      label: "Title",
      description: "The context name (maximum 200 characters).",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The custom AI instruction text for this context (maximum 20,000 characters). Describe how Hedy should analyze meetings — e.g., focus areas, summary style, or specific data to extract.",
      optional: true,
    },
    isDefault: {
      type: "boolean",
      label: "Set as Default",
      description: "Set to `true` to make this the default context automatically applied to new sessions.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
    };
    if (this.content) data.content = this.content;
    if (this.isDefault !== undefined) data.isDefault = this.isDefault;

    const response = await this.app.createContext({
      $,
      data,
    });
    const context = response?.data || response;
    $.export("$summary", `Created session context: ${context?.title || this.title}`);
    return response;
  },
};
