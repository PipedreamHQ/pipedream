import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-block-card",
  name: "Block Card (Or Task)",
  version: "0.0.1",
  description: "Block a card or a task.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
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
      optional: true,
    },
    blockReason: {
      propDefinition: [
        planview_leankit,
        "blockReason",
      ],
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardId,
      taskId,
      blockReason,
    } = this;

    const response = await planview_leankit.updateCard({
      $,
      cardId: taskId || cardId,
      data: [
        {
          "op": "add",
          "path": "/blockReason",
          "value": blockReason,
        },
        {
          "op": "replace",
          "path": "/isBlocked",
          "value": true,
        },
      ],
    });

    $.export("$summary", `The ${taskId
      ? "task"
      : "card"} with id ${taskId || cardId} was successfully blocked!`);
    return response;
  },
};
