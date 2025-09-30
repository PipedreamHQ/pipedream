import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-get-all-cards",
  name: "Get All Cards",
  description: "Fetches all cards in a pipe. [See the docs here](https://api-docs.pipefy.com/reference/queries/#allCards)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    max: {
      type: "integer",
      label: "Max Cards",
      description: "Maximum number of cards to return",
      default: 100,
    },
  },
  async run({ $ }) {
  /*
  Example query:

  {
    allCards(pipeId: 301498507) {
    pageInfo{hasNextPage} edges{node{title}}
  }
  */
    const cards = [];
    let hasNextPage, cursor;
    do {
      const {
        edges, pageInfo,
      } = await this.pipefy.listCards(this.pipe, cursor);
      cards.push(...edges);
      if (cards.length >= this.max) {
        break;
      }
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    } while (hasNextPage);

    if (cards.length > this.max) {
      cards.length = this.max;
    }

    $.export("$summary", `Successfully retrieved ${cards.length} card(s)`);
    return cards;
  },
};
