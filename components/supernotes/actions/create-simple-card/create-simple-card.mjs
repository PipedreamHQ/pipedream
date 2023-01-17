import app from "../../supernotes.app.mjs";

export default {
  key: "supernotes-create-simple-card",
  name: "Create a simple card.",
  description: "Create a single card with the minimum amount of data required. [See docs here](https://api.supernotes.app/docs/swagger#/cards/_simple_create_card_v1_cards_simple_post).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    markup: {
      propDefinition: [
        app,
        "markup",
      ],
    },
    icon: {
      propDefinition: [
        app,
        "icon",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const {
      name,
      markup,
      icon,
      tags,
    } = this;

    const response = await this.app.createSimpleCard({
      $,
      data: {
        name,
        markup,
        icon,
        tags,
      },
    });
    const card = response.pop();
    if (card) {
      $.export("$summary", `Successfully created card with ID: "${card.payload.data.id}"`);
    }
    return card;
  },
};
