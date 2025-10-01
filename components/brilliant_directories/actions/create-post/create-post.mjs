import qs from "qs";
import app from "../../brilliant_directories.app.mjs";

export default {
  key: "brilliant_directories-create-post",
  name: "Create Post",
  description: "Creates a single or group post. [See the documentation](https://support.brilliantdirectories.com/support/solutions/articles/12000093239-member-posts-api-create-update-delete-and-get-member-posts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    dataId: {
      propDefinition: [
        app,
        "dataId",
      ],
    },
    dataType: {
      propDefinition: [
        app,
        "dataType",
      ],
    },
    postTitle: {
      propDefinition: [
        app,
        "postTitle",
      ],
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
    const response = await this.app.createPost({
      data: qs.stringify({
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
      }),
    });

    $.export("$summary", `Successfully created post with ID: ${response.message?.post_id}`);
    return response;
  },
};
