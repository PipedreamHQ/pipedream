import app from "../../basecamp.app.mjs";

export default {
  key: "basecamp-create-card",
  name: "Create a Card",
  description: "Creates a card in the select column. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/card_table_cards.md#create-a-card)",
  type: "action",
  version: "0.0.2",
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
    todoSetId: {
      propDefinition: [
        app,
        "todoSetId",
        ({
          accountId,
          projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
    },
    todoListId: {
      propDefinition: [
        app,
        "todoListId",
        ({
          accountId,
          projectId,
          todoSetId,
        }) => ({
          accountId,
          projectId,
          todoSetId,
        }),
      ],
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "The column ID",
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
    },
    dueOn: {
      type: "string",
      label: "Due on",
      description: "Due date (ISO 8601) of the card, e.g.: `2023-12-12`",
    },
    notify: {
      type: "boolean",
      label: "Notify",
      description: "Whether to notify assignees. Defaults to false",
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
