import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-update-card",
  name: "Update Card",
  description: "Updates an existing card. [See the docs here](https://api-docs.pipefy.com/reference/mutations/updateCard/)",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipefy,
    organization: {
      propDefinition: [
        pipefy,
        "organization",
      ],
    },
    pipe: {
      propDefinition: [
        pipefy,
        "pipe",
        (c) => ({
          orgId: c.organization,
        }),
      ],
    },
    card: {
      propDefinition: [
        pipefy,
        "card",
        (c) => ({
          pipeId: c.pipe,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "New title of the card",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The new card due date. An ISO‐8601 encoded UTC date time string (YYYY-MM-DD HH:MM:SS).",
      optional: true,
    },
    assignees: {
      propDefinition: [
        pipefy,
        "members",
        (c) => ({
          orgId: c.organization,
        }),
      ],
    },
  },
  async run({ $ }) {
  /*
  Example query:

  mutation updateExistingCard{
    updateCard(
        input: {id: 397325159, title: "UpdatedCard" } ) {
            card{id title createdBy{name}}
        }
    }

  */
    const { card } = await this.pipefy.getCard(this.card);
    const variables = {
      id: this.card,
      title: this.title || card.title,
      dueDate: this.dueDate || card.due_date,
      assigneeIds: this.assignees,
    };

    const response = await this.pipefy.updateCard(variables);
    $.export("$summary", "Successfully updated card");
    return response;
  },
};
