import figmaApp from "../../figma.app.mjs";

export default {
  name: "Post a Comment",
  description: "Posts a comment to a file. [See the docs here](https://www.figma.com/developers/api#post-comments-endpoint)",
  key: "figma-post-a-comment",
  version: "0.0.1",
  type: "action",
  props: {
    figmaApp,
    teamId: {
      propDefinition: [
        figmaApp,
        "teamId",
      ],
    },
    projectId: {
      propDefinition: [
        figmaApp,
        "projectId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    fileId: {
      propDefinition: [
        figmaApp,
        "fileId",
        ({ projectId }) => ({
          projectId,
        }),
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
