import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-assign-user-to-task",
  name: "Assign User To Task",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Assign one or more users to tasks. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/assign-users)",
  type: "action",
  props: {
    planviewLeankit,
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
    },
    taskId: {
      propDefinition: [
        planviewLeankit,
        "taskId",
        ({ cardId }) => ({
          cardId,
        }),
      ],
      type: "string[]",
    },
    userIdsToAssign: {
      propDefinition: [
        planviewLeankit,
        "userId",
      ],
      type: "string[]",
    },
    wipOverrideComment: {
      propDefinition: [
        planviewLeankit,
        "wipOverrideComment",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      taskId,
      ...data
    } = this;

    const response = await planviewLeankit.assignUserToCard({
      $,
      data: {
        cardIds: taskId,
        ...data,
      },
    });

    $.export("$summary", `User${this.userIdsToAssign.length === 1
      ? ` (${this.userIdsToAssign.toString()}) was`
      : `s (${this.userIdsToAssign.toString()} were`} successfully assigned!`);
    return response;
  },
};
