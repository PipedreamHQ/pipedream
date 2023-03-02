import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-move-cards-to-another-board",
  name: "Move Cards To Another Board",
  version: "0.0.1",
  description: "Move cards to other boards.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/move)",
  type: "action",
  props: {
    planview_leankit,
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
      description: "The origin board id.",
    },
    cardIds: {
      propDefinition: [
        planview_leankit,
        "cardId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      type: "string[]",
    },
    toBoardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
      description: "The destination board id.",
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardIds,
      toBoardId,
    } = this;

    const response = await planview_leankit.moveCards({
      $,
      data: {
        cardIds,
        destination: {
          boardId: toBoardId,
        },
      },
    });

    $.export("$summary", `Card${this.cardIds.length === 1
      ? " was"
      : "s were"} successfully moved!`);
    return response;
  },
};
