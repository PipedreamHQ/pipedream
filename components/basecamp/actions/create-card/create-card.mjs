import app from "../../basecamp.app.mjs";
import common from "../../common/common.mjs";

export default {
  key: "basecamp-create-card",
  name: "Create a Card",
  description: "Creates a card in a selected column. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/card_table_cards.md#create-a-card)",
  type: "action",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
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
      description: "The title of the new card.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the card. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/card_table_cards.md#create-a-card) for information on using HTML tags.",
      optional: true,
    },
    dueOn: {
      type: "string",
      label: "Due On",
      description: "The due date of the card, in `YYYY-MM-DD` format.",
      optional: true,
    },
    notify: {
      type: "boolean",
      label: "Notify Assignees",
      description: "Whether to notify assignees.",
      optional: true,
      default: false,
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

    $.export("$summary", `Successfully created card (ID: ${card.id})`);
    return card;
  },
};
