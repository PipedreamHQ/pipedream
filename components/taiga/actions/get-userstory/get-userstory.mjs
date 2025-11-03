import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-get-userstory",
  name: "Get User Story",
  description: "Get an existing user story from a Taiga project. [See the documentation](https://docs.taiga.io/api.html#user-stories-get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    taiga,
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    userStoryId: {
      propDefinition: [
        taiga,
        "userStoryId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taiga.getUserStory({
      $,
      userStoryId: this.userStoryId,
    });

    $.export("$summary", `Retrieved user story: ${this.userStoryId}`);
    return response;
  },
};
