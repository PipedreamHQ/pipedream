import common from "../common.mjs";

export default {
  ...common,
  key: "trello-add-existing-label-to-card",
  name: "Add Existing Label to Card",
  description: "Adds an existing label to the specified card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-post)",
  version: "0.0.2",
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
      description: "The ID of the Card to add the Label to",
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
    },
  },
  async run({ $ }) {
    const res = await this.trello.addExistingLabelToCard(this.idCard, {
      value: this.idLabel,
    }, $);
    $.export("$summary", `Successfully added label ${this.idLabel} to card ${this.idCard}`);
    return res;
  },
};
