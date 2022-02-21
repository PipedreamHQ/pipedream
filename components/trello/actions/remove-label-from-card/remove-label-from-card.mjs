import common from "../common";

export default {
  ...common,
  key: "trello-add-remove-label-from-card",
  name: "Remove a Label from a Card",
  description: "Removes an existing label from the specified card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-idlabel-delete)",
  version: "0.1.2",
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
    const res = await this.trello.removeLabelFromCard(this.idCard,
      this.idLabel,
      $);
    $.export("$summary", `Successfully removed label ${this.idLabel} to list ${this.idCard}`);
    return res;
  },
};
