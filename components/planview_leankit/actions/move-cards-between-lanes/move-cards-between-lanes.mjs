import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-move-cards-between-lanes",
  name: "Move Cards Between Lanes",
  version: "0.0.1",
  description: "Move cards between lanes.  [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/move)",
  type: "action",
  props: {
    planview_leankit,
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
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
    laneId: {
      propDefinition: [
        planview_leankit,
        "laneId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      cardIds,
      laneId,
    } = this;

    const response = await planview_leankit.moveCards({
      $,
      data: {
        cardIds,
        destination: {
          laneId,
        },
      },
    });

    $.export("$summary", `Card${this.cardIds.length === 1
      ? " was"
      : "s were"} successfully moved!`);
    return response;
  },
};
