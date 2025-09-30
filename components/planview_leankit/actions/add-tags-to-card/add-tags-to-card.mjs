import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-add-tags-to-card",
  name: "Add Tags To Card (Or Task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add tags in a card or task. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
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
    tags: {
      propDefinition: [
        planviewLeankit,
        "tags",
        ({ cardId }) => ({
          cardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
      taskId,
      tags,
    } = this;

    const response = await planviewLeankit.updateCard({
      $,
      cardId: taskId || cardId,
      data: [
        {
          "op": "add",
          "path": "/tags",
          "value": typeof tags === "string"
            ? JSON.parse(tags)
            : tags,
        },
      ],
    });

    $.export("$summary", `${tags.length} new tag${tags.length === 1
      ? " was"
      : "s were"} successfully added to ${taskId
      ? "task"
      : "card"} with id ${taskId || cardId}!`);
    return response;
  },
};
