import guru from "../../guru.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "guru-create-card",
  name: "Create Card",
  description: "Creates a new card on your Guru account. [See the documentation](https://developer.getguru.com/reference/postv1cardscreateextendedfact)",
  version: "0.0.1",
  type: "action",
  props: {
    guru,
    cardTitle: {
      propDefinition: [
        guru,
        "cardTitle",
      ],
    },
    content: {
      propDefinition: [
        guru,
        "content",
      ],
    },
    groupId: {
      propDefinition: [
        guru,
        "groupId",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        guru,
        "userId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.guru.createCard({
      cardTitle: this.cardTitle,
      content: this.content,
      groupId: this.groupId,
      userId: this.userId,
    });

    $.export("$summary", `Created card "${this.cardTitle}" successfully`);
    return response;
  },
};
