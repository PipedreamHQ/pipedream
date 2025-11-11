import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-move-cards-to-another-board",
  name: "Move Cards To Another Board",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Move cards to other boards. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/move)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
      description: "The origin board id.",
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
    toBoardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
      description: "The destination board id.",
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardIds,
      toBoardId,
    } = this;

    const response = await planviewLeankit.moveCards({
      $,
      data: {
        cardIds,
        destination: {
          boardId: toBoardId,
        },
      },
    });

    $.export("$summary", `${this.cardIds.length} card${this.cardIds.length === 1
      ? " was"
      : "s were"} successfully moved!`);
    return response;
  },
};
