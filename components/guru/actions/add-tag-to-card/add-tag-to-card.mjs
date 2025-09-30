import guru from "../../guru.app.mjs";

export default {
  key: "guru-add-tag-to-card",
  name: "Add Tag to Card",
  description: "Links an existing tag to a specified card in Guru. [See the documentation](https://developer.getguru.com/reference/getv1cardsgetextendedfact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    guru,
    cardId: {
      propDefinition: [
        guru,
        "cardId",
      ],
    },
    tags: {
      propDefinition: [
        guru,
        "tags",
      ],
      type: "string",
      label: "Tag",
      description: "The ID of the tag to add to the card",
    },
  },
  async run({ $ }) {
    const response = await this.guru.linkTagToCard({
      $,
      cardId: this.cardId,
      tagId: this.tags,
    });

    $.export("$summary", `Successfully linked tag ${this.tags} to card ${this.cardId}`);
    return response;
  },
};
