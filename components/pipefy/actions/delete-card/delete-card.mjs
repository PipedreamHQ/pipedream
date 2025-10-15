import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-delete-card",
  name: "Delete Card",
  description: "Deletes a card. [See the docs here](https://api-docs.pipefy.com/reference/mutations/deleteCard/)",
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
  },
  async run({ $ }) {
  /*
  Example query:

  mutation deleteExistingCard{
      deleteCard(
          input: {id: 398480509 } ) {
              success
          }
      }
  */

    const variables = {
      id: this.card,
    };

    const response = await this.pipefy.deleteCard(variables);
    $.export("$summary", "Successfully deleted card");
    return response;
  },
};
