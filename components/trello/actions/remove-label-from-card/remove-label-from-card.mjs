import common from "../common.mjs";

export default {
  ...common,
  key: "trello-remove-label-from-card",
  name: "Remove Card Label",
  description: "Removes label from card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-idlabel-delete).",
  version: "0.2.0",
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
      description: "The ID of the Card to remove the Label from",
      optional: false,
    },
    labelId: {
      propDefinition: [
        common.props.app,
        "label",
        (c) => ({
          board: c.board,
        }),
      ],
      description: "The ID of the Label to be removed from the card.",
    },
  },
  methods: {
    removeLabelFromCard({
      cardId, labelId, ...args
    } = {}) {
      return this.app.delete({
        path: `/cards/${cardId}/idLabels/${labelId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    await this.removeLabelFromCard({
      $,
      cardId: this.cardId,
      labelId: this.labelId,
    });
    $.export("$summary", "Successfully sent request to remove label from card.");
    return {
      success: true,
    };
  },
};
