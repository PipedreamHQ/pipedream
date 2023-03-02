import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-assign-user-to-task",
  name: "Assign User To Task",
  version: "0.0.1",
  description: "Assign one or more users to tasks. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/assign-users)",
  type: "action",
  props: {
    planview_leankit,
    cardIds: {
      propDefinition: [
        planview_leankit,
        "cardId",
      ],
    },
    taskId: {
      propDefinition: [
        planview_leankit,
        "taskId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      type: "string[]",
      optional: true,
    },
    userIdsToAssign: {
      propDefinition: [
        planview_leankit,
        "userId",
      ],
      type: "string[]",
    },
    wipOverrideComment: {
      propDefinition: [
        planview_leankit,
        "wipOverrideComment",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      taskId,
      ...data
    } = this;

    const response = await planview_leankit.assignUserToCard({
      $,
      data: {
        cardIds: taskId,
        ...data,
      },
    });

    $.export("$summary", `User${this.userIdsToAssign.length === 1
      ? " was"
      : "s were"} successfully assigned!`);
    return response;
  },
};
