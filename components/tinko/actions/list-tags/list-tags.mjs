import app from "../../tinko.app.mjs";

export default {
  key: "tinko-list-tags",
  name: "List Tags",
  description: "List the tags of the company."
    + " Use the returned `id` with **Add Tag to Contact**, **Create Contact**, **Update Contact**, **Find Contact** or **List Chats**."
    + " Use **Create Tag** when the tag does not exist yet."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/tags/#listar-tags)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Name Contains",
      description: "Return only tags whose name contains this value, e.g. `VIP`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const tags = await this.app.getPaginatedResults({
      fn: this.app.listTags,
      args: {
        $,
        params: {
          search: this.search,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${tags.length} tag${tags.length === 1
      ? ""
      : "s"}`);
    return tags;
  },
};
