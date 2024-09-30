import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-add-existing-label-to-card",
  name: "Add Existing Label to Card",
  description: "Adds an existing label to the specified card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-post).",
  version: "0.1.0",
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
      description: "The ID of the Card to add the Label to",
      optional: false,
    },
    value: {
      propDefinition: [
        common.props.app,
        "label",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.addExistingLabelToCard({
      $,
      cardId: this.cardId,
      params: {
        value: this.value,
      },
    });
    $.export("$summary", `Successfully added label and returned \`${res.length}\` labels added.`);
    return res;
  },
};
