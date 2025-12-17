import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-unblock-card",
  name: "Unblock Card (Or Task)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Unlock a card or a task. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
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
      optional: true,
    },
    blockReason: {
      propDefinition: [
        planviewLeankit,
        "blockReason",
      ],
      label: "Unblock Reason",
      description: "The unblock reason.",
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
      taskId,
      blockReason,
    } = this;

    const response = await planviewLeankit.updateCard({
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
          "value": false,
        },
      ],
    });

    $.export("$summary", `The ${taskId
      ? "task"
      : "card"} with id ${taskId || cardId} was successfully unblocked!`);
    return response;
  },
};
