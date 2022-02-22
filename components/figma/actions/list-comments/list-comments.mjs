import figmaApp from "../../figma.app.mjs";
import { axios } from "@pipedream/platform";

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

    const res = await axios($, this.figmaApp._getAxiosParams({
      method: "GET",
      path: `/v1/files/${fileId}/comments`,
    }));

    if (res.comments?.length > 0) {
      $.export("$summary", `Successfully fetched ${res.comments.length} comment(s)`);
    } else {
      $.export("$summary", "No comments fetched");
    }
    return res?.comments;
  },
};
