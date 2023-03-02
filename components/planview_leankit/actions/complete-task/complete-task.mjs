import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-complete-task",
  name: "Complete Task",
  version: "0.0.1",
  description: "Move a task to `completed` lane. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/move)",
  type: "action",
  props: {
    planview_leankit,
    cardId: {
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
    },
    taskLaneId: {
      propDefinition: [
        planview_leankit,
        "taskLaneId",
        ({ cardId }) => ({
          cardId,
          status: "completed",
        }),
      ],
    },
    index: {
      propDefinition: [
        planview_leankit,
        "index",
      ],
      description: "The position of the task in the lane starting at 0 as the first position.",
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      taskId,
      taskLaneId,
      index,
    } = this;

    const response = await planview_leankit.moveCards({
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
