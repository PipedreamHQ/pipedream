import common from "../common.mjs";

export default {
  ...common,
  key: "trello-add-member-to-card",
  name: "Add Member to Card",
  description: "Adds a member to the specified card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idmembers-post)",
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
      description: "The ID of the Card to add the Member to",
      optional: false,
    },
    idMember: {
      propDefinition: [
        common.props.trello,
        "member",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  async run({ $ }) {
    const res = await this.trello.addMemberToCard(this.idCard, {
      value: this.idMember,
    }, $);
    $.export("$summary", `Successfully added member ${res[0].fullName} to card ${this.idCard}`);
    return res;
  },
};
