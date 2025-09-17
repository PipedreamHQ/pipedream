import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-delete-userstory",
  name: "Delete User Story",
  description: "Delete an existing user story from a Taiga project. [See the documentation](https://docs.taiga.io/api.html#user-stories-delete)",
  version: "0.0.1",
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
    const response = await this.taiga.deleteUserStory({
      $,
      userStoryId: this.userStoryId,
    });

    $.export("$summary", `Deleted user story: ${this.userStoryId}`);
    return response;
  },
};
