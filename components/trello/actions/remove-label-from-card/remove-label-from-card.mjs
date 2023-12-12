import common from "../common.mjs";

export default {
  ...common,
  key: "trello-remove-label-from-card",
  name: "Remove Card Label",
  description: "Removes label from card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-idlabel-delete)",
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
      description: "The ID of the Card to remove the Label from",
      optional: false,
    },
    idLabel: {
      propDefinition: [
        common.props.trello,
        "label",
        (c) => ({
          board: c.board,
        }),
      ],
      description: "The ID of the Label to be removed from the card.",
    },
  },
  async run({ $ }) {
    const res = await this.trello.removeLabelFromCard(this.idCard, this.idLabel, $);
    $.export("$summary", `Successfully removed label ${this.idLabel} from card ${this.idCard}`);
    return res;
  },
};
