import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-move-card-to-list",
  name: "Move Card to List",
  description: "Moves a card to the specified board/list pair. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put).",
  version: "0.2.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    cardId: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the card to move",
      optional: false,
    },
    idList: {
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "List",
      description: "The ID of the list that the card should be moved to.",
      optional: false,
    },
  },
  async run({ $ }) {
    const res = await this.app.updateCard({
      $,
      cardId: this.cardId,
      data: {
        idBoard: this.board,
        idList: this.idList,
      },
    });
    $.export("$summary", `Successfully moved card ${this.cardId} to list ${this.idList}`);
    return res;
  },
};
