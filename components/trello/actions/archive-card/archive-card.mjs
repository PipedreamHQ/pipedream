import common from "../common.mjs";

export default {
  ...common,
  key: "trello-archive-card",
  name: "Archive Card",
  description: "Archives a card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put)",
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
      description: "The ID of the Card to archive",
      optional: false,
    },
  },
  async run({ $ }) {
    const res = await this.trello.archiveCard(this.idCard, $);
    $.export("$summary", `Successfully archived card ${this.idCard}`);
    return res;
  },
};
