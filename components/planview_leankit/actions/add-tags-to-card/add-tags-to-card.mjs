import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-add-tags-to-card",
  name: "Add Tags To Card (Or Task)",
  version: "0.0.1",
  description: "Add tags in a card or task.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
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
    tags: {
      propDefinition: [
        planview_leankit,
        "tags",
        ({ cardId }) => ({
          cardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardId,
      taskId,
      tags,
    } = this;

    const response = await planview_leankit.updateCard({
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

    $.export("$summary", `New tag${this.tags.length === 1
      ? " was"
      : "s were"} successfully added to ${taskId
      ? "task"
      : "card"} with id ${taskId || cardId}!`);
    return response;
  },
};
