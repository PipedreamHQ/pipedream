import guru from "../../guru.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "guru-add-tag-to-card",
  name: "Add Tag to Card",
  description: "Links an existing tag to a specified card in Guru. [See the documentation](https://developer.getguru.com/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    guru,
    cardId: {
      propDefinition: [
        guru,
        "cardId",
      ],
    },
    tagId: {
      propDefinition: [
        guru,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.guru.linkTagToCard({
      cardId: this.cardId,
      tagId: this.tagId,
    });

    $.export("$summary", `Successfully linked tag ${this.tagId} to card ${this.cardId}`);
    return response;
  },
};
