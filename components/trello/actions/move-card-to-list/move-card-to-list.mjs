import common from "../common.mjs";

export default {
  ...common,
  key: "trello-move-card-to-list",
  name: "Move Card to List",
  description: "Moves a card to the specified board/list pair. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put)",
  version: "0.1.3",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    idCard: {
      propDefinition: [
        common.props.trello,
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
    toIdList: {
      propDefinition: [
        common.props.trello,
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
    const res = await this.trello.moveCardToList(this.idCard, {
      idBoard: this.board,
      idList: this.toIdList,
    }, $);
    $.export("$summary", `Successfully moved card ${this.idCard} to list ${this.toIdList}`);
    return res;
  },
};
