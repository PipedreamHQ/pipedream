import app from "../../blink.app.mjs";

export default {
  name: "Post feed",
  version: "0.0.1",
  key: "blink-post-feed",
  description: "Send feed events to users. [See the documentation](https://developer.joinblink.com/reference/send-feed-event)",
  type: "action",
  props: {
    app,
    allowComments: {
      type: "boolean",
      label: "Allow comments",
      description: "Allow users to comment on the feed event.",
    },
    category: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    ribbonColor: {
      type: "string",
      label: "Ribbon color",
      description: "Color of the card. Hex code",
    },
    sections: {
      type: "object",
      label: "Sections",
      description: "CardKit section objects. E.g. `[ { \"type\": \"header\", \"title\": \"Main API Service - Build Failed\" }, { \"type\": \"text\", \"value\": \"2/32 Tests Failed\" }, { \"type\": \"image\", \"image_url\": \"https://picsum.photos/200/300\" }, { \"type\": \"link\", \"title\": \"Blink\", \"url\": \"https://joinblink.com\" } ]`",
    },
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "IDs of the users who will receive this feed event",
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const sections = typeof this.sections === "string"
      ? JSON.parse(this.sections)
      : this.sections;

    const response = await this.app.postFeed({
      $,
      data: {
        allow_comments: this.allowComments,
        category: this.category,
        body: {
          ribbon_color: this.ribbonColor,
          sections,
        },
        user_ids: this.userIds,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent post to feed with event ID \`${response.data.event_id}\``);
    }

    return response;
  },
};
