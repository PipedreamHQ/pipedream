import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-complete-task",
  name: "Complete Task",
  version: "0.0.1",
  description: "Move a task to `completed` lane. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/move)",
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
    },
    taskLaneId: {
      propDefinition: [
        planviewLeankit,
        "taskLaneId",
        ({ cardId }) => ({
          cardId,
          status: "completed",
        }),
      ],
    },
    index: {
      propDefinition: [
        planviewLeankit,
        "index",
      ],
      description: "The position of the task in the lane starting at 0 as the first position.",
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      taskId,
      taskLaneId,
      index,
    } = this;

    const response = await planviewLeankit.moveCards({
      $,
      data: {
        cardIds: [
          taskId,
        ],
        destination: {
          laneId: taskLaneId,
          index,
        },
      },
    });

    $.export("$summary", `Task with id ${taskId} was successfully completed!`);
    return response;
  },
};
