import figmaApp from "../../figma.app.mjs";

export default {
  name: "List Comments",
  description: "Lists all comments left on a file. [See the docs here](https://www.figma.com/developers/api#get-comments-endpoint)",
  key: "figma-list-comments",
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
