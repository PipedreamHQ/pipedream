import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-create-comment",
  name: "Add Comment To Card (Or Task)",
  version: "0.0.1",
  description: "Create a comment in a card or task.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/comment/create)",
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
    text: {
      type: "string",
      label: "Comment",
      description: "The comment's text",
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardId,
      taskId,
      ...data
    } = this;

    const response = await planview_leankit.createComment({
      $,
      cardId: taskId || cardId,
      data,
    });

    $.export("$summary", `A new comment with id ${response.id} was successfully added!`);
    return response;
  },
};
