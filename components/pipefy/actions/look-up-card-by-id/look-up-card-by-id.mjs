import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-look-up-card-by-id",
  name: "Look up Card by ID",
  description: "Looks up a card by its ID. [See the docs here](https://api-docs.pipefy.com/reference/queries/#card)",
  version: "0.3.3",
  annotations: {
    destructiveHint: false,
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

  {
    card(id: 301498507) {
      title url comments{text}
    }
  }
  */

    const response = await this.pipefy.getCard(this.card);
    $.export("$summary", "Successfully retrieved card");
    return response;
  },
};
