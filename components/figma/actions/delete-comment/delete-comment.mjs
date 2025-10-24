import common from "../../common/common.mjs";
const { figmaApp } = common.props;

export default {
  ...common,
  name: "Delete a Comment",
  description: "Delete a comment to a file. [See the docs here](https://www.figma.com/developers/api#delete-comments-endpoint)",
  key: "figma-delete-comment",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
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
