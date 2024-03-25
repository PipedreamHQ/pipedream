import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-update-post",
  name: "Update a Post",
  description: "Updates a page or blog post on Confluence by its ID",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    confluence,
    postType: {
      propDefinition: [
        confluence,
        "postType",
      ],
    },
    postId: {
      propDefinition: [
        confluence,
        "postId",
      ],
    },
    newContent: {
      propDefinition: [
        confluence,
        "newContent",
      ],
    },
    newTitle: {
      propDefinition: [
        confluence,
        "newTitle",
      ],
      optional: true,
    },
    spaceKey: {
      propDefinition: [
        confluence,
        "spaceKey",
      ],
      optional: true,
    },
    parentPage: {
      propDefinition: [
        confluence,
        "parentPage",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.confluence.updatePost({
      postType: this.postType,
      postId: this.postId,
      newContent: this.newContent,
      newTitle: this.newTitle,
      spaceKey: this.spaceKey,
      parentPage: this.parentPage,
    });
    $.export("$summary", `Successfully updated post with ID: ${this.postId}`);
    return response;
  },
};
