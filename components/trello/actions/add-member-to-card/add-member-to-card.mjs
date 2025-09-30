import app from "../../trello.app.mjs";

export default {
  key: "trello-add-member-to-card",
  name: "Add Member to Card",
  description: "Adds a member to the specified card. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idmembers-post).",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    board: {
      propDefinition: [
        app,
        "board",
      ],
    },
    cardId: {
      propDefinition: [
        app,
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
        app,
        "member",
        (c) => ({
          board: c.board,
          card: c.cardId,
          excludeCardMembers: true,
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
