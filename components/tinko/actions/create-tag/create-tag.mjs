import app from "../../tinko.app.mjs";

export default {
  key: "tinko-create-tag",
  name: "Create Tag",
  description: "Create a new tag to organize contacts and chats."
    + " Use **List Tags** first to check whether the tag already exists, and **Add Tag to Contact** to apply it."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/tags/#criar-tag)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    text: {
      type: "string",
      label: "Name",
      description: "Name of the tag, e.g. `VIP Customer`.",
    },
    emoji: {
      type: "string",
      label: "Emoji",
      description: "Emoji shown next to the tag name, e.g. `⭐`.",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "Color of the tag as a six digit hex code, e.g. `#27D366`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createTag({
      $,
      data: {
        text: this.text,
        emoji: this.emoji,
        color: this.color,
      },
    });

    $.export("$summary", `Successfully created tag ${response.data?.text || this.text}`);
    return response.data;
  },
};
