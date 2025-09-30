import common from "../../common/common.mjs";
const { figmaApp } = common.props;

export default {
  ...common,
  name: "List Comments",
  description: "Lists all comments left on a file. [See the docs here](https://www.figma.com/developers/api#get-comments-endpoint)",
  key: "figma-list-comments",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
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
  },
  async run({ $ }) {
    const { fileId } = this;

    const comments = await this.figmaApp.listFileComments(fileId, $);

    if (comments.length > 0) {
      $.export("$summary", `Successfully fetched ${comments.length} comment(s)`);
    } else {
      $.export("$summary", "No comments fetched");
    }
    return comments;
  },
};
