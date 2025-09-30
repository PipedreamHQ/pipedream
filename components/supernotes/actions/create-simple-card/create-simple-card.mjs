import app from "../../supernotes.app.mjs";

export default {
  key: "supernotes-create-simple-card",
  name: "Create a simple card",
  description: "Create a single card with the minimum amount of data required. [See docs here](https://api.supernotes.app/docs/swagger#/cards/_simple_create_card_v1_cards_simple_post).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  methods: {
    createSimpleCard({
      $ = this,
      data,
    }) {
      return this.app._makeRequest({
        $,
        config: {
          path: "/v1/cards/simple",
          data,
          method: "POST",
        },
      });
    },
  },
  async run({ $ }) {
    const {
      name,
      markup,
      icon,
      tags,
    } = this;

    const response = await this.createSimpleCard({
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
