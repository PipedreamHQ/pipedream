import common from "../common/common.mjs";

export default {
  ...common,
  key: "trello-add-member-to-card",
  name: "Add Member to Card",
  description: "Adds a member to the specified card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idmembers-post).",
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
      description: "The ID of the Card to add the Member to",
      optional: false,
    },
    value: {
      propDefinition: [
        common.props.app,
        "member",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.addMemberToCard({
      $,
      cardId: this.cardId,
      params: {
        value: this.value,
      },
    });
    $.export("$summary", `Successfully added member ${res[0].fullName} to card ${this.cardId}`);
    return res;
  },
};
