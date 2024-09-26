import app from "../../basecamp.app.mjs";

export default {
  key: "basecamp-create-card",
  name: "Create a Card",
  description: "Creates a card in the select column. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/card_table_cards.md#create-a-card)",
  type: "action",
  version: "0.1.0",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    cardTableId: {
      propDefinition: [
        app,
        "cardTableId",
        ({
          accountId, projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
    },
    columnId: {
      propDefinition: [
        app,
        "columnId",
        ({
          accountId, projectId, cardTableId,
        }) => ({
          accountId,
          projectId,
          cardTableId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the card",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the card",
      optional: true,
    },
    dueOn: {
      type: "string",
      label: "Due on",
      description: "Due date (ISO 8601) of the card, e.g.: `2023-12-12`",
      optional: true,
    },
    notify: {
      type: "boolean",
      label: "Notify",
      description: "Whether to notify assignees. Defaults to false",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      projectId,
      columnId,
      title,
      content,
      dueOn,
      notify,
    } = this;

    const card = await this.app.createCard({
      $,
      accountId,
      projectId,
      columnId,
      data: {
        title,
        content,
        due_on: dueOn,
        notify,
      },
    });

    $.export("$summary", `Successfully created card with ID ${card.id}`);
    return card;
  },
};
