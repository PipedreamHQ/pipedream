import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-delete-tag",
  name: "Delete Tag",
  description: "Deletes a tag from a Clockify workspace. This cannot be undone. Use **List Tags** to find the ID of the tag to delete. [See the documentation](https://docs.clockify.me/#tag/Tag/operation/deleteTag)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    tagId: {
      propDefinition: [
        clockify,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    await this.clockify.deleteTag({
      $,
      workspaceId: this.workspaceId,
      tagId: this.tagId,
    });

    $.export("$summary", `Successfully deleted tag with ID ${this.tagId}`);

    return {
      success: true,
    };
  },
};
