import common from "../../common/common.mjs";
const { figmaApp } = common.props;

export default {
  ...common,
  name: "Post a Comment",
  description: "Posts a comment to a file. [See the docs here](https://www.figma.com/developers/api#post-comments-endpoint)",
  key: "figma-post-a-comment",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        figmaApp,
        "projectId",
      ],
    },
    fileId: {
      propDefinition: [
        figmaApp,
        "fileId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text contents of the comment to post",
    },
    commentId: {
      propDefinition: [
        figmaApp,
        "commentId",
        ({ fileId }) => ({
          fileId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      fileId,
      message,
      commentId,
    } = this;

    const data = {
      message,
      comment_id: commentId,
    };
    const res = await this.figmaApp.postComment(fileId, data, $);

    $.export("$summary", "Comment successfully posted");
    return res;
  },
};
