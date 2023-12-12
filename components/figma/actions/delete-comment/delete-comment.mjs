import figmaApp from "../../figma.app.mjs";

export default {
  name: "Delete a Comment",
  description: "Delete a comment to a file. [See the docs here](https://www.figma.com/developers/api#delete-comments-endpoint)",
  key: "figma-delete-comment",
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
      commentId,
    } = this;

    const res = await this.figmaApp.deleteComment(fileId, commentId, $);

    $.export("$summary", "Comment successfully deleted");
    return res;
  },
};
