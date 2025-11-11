import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-move-cards-between-lanes",
  name: "Move Cards Between Lanes",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Move cards between lanes. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/move)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    cardIds: {
      propDefinition: [
        planviewLeankit,
        "cardId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
      type: "string[]",
    },
    laneId: {
      propDefinition: [
        planviewLeankit,
        "laneId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardIds,
      laneId,
    } = this;

    const response = await planviewLeankit.moveCards({
      $,
      data: {
        cardIds,
        destination: {
          laneId,
        },
      },
    });

    $.export("$summary", `${this.cardIds.length} card${this.cardIds.length === 1
      ? " was"
      : "s were"} successfully moved!`);
    return response;
  },
};
