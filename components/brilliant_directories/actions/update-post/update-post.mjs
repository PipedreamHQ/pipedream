import qs from "qs";
import app from "../../brilliant_directories.app.mjs";
import { clearObj } from "../../common/utils.mjs";

export default {
  key: "brilliant_directories-update-post",
  name: "Update Post",
  description: "Updates a post in your website database. [See the documentation](https://support.brilliantdirectories.com/support/solutions/articles/12000088887-api-overview-and-testing-the-api-from-admin-area)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    postId: {
      type: "string",
      label: "Post ID",
      description: "The unique identifier for the post to update",
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    dataId: {
      propDefinition: [
        app,
        "dataId",
      ],
      optional: true,
    },
    dataType: {
      propDefinition: [
        app,
        "dataType",
      ],
      optional: true,
    },
    postTitle: {
      propDefinition: [
        app,
        "postTitle",
      ],
      optional: true,
    },
    postContent: {
      propDefinition: [
        app,
        "postContent",
      ],
      optional: true,
    },
    postCategory: {
      propDefinition: [
        app,
        "postCategory",
      ],
      optional: true,
    },
    postType: {
      propDefinition: [
        app,
        "postType",
      ],
      optional: true,
    },
    postTags: {
      propDefinition: [
        app,
        "postTags",
      ],
      optional: true,
    },
    postStatus: {
      propDefinition: [
        app,
        "postStatus",
      ],
      optional: true,
    },
    postStartDate: {
      propDefinition: [
        app,
        "postStartDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updatePost({
      data: qs.stringify(clearObj({
        post_id: this.postId,
        user_id: this.userId,
        data_id: this.dataId,
        data_type: this.dataType,
        post_title: this.postTitle,
        post_content: this.postContent,
        post_category: this.postCategory,
        post_type: this.postType,
        post_tags: this.postTags && this.postTags.toString(),
        post_status: +this.postStatus,
        post_start_date: this.postStartDate,
      })),
    });

    $.export("$summary", `Successfully updated post with ID ${this.postId}`);
    return response;
  },
};
