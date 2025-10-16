import snappy from "../../snappy.app.mjs";

export default {
  name: "Create Wall Post",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "snappy-create-wall-post",
  description: "Creates a wall post. [See docs here](https://github.com/BeSnappy/api-docs#posting-to-team-wall)",
  type: "action",
  props: {
    snappy,
    accountId: {
      propDefinition: [
        snappy,
        "accountId",
      ],
    },
    content: {
      label: "Content",
      description: "The content of the post",
      type: "string",
    },
    tags: {
      label: "Tags",
      description: "The tags of the post. E.g `[\"amazing\", \"urgent\"]`",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const response = await this.snappy.createWallPost({
      $,
      accountId: this.accountId,
      data: {
        type: "post",
        content: this.content,
        tags: typeof this.tags === "string"
          ? JSON.parse(this.tags)
          : this.tags,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created wall post with id ${response.id}`);
    }

    return response;
  },
};
