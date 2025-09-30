import app from "../../blink.app.mjs";

export default {
  name: "Post feed",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "blink-post-feed",
  description: "Send feed events to users. [See the documentation](https://developer.joinblink.com/reference/send-feed-event)",
  type: "action",
  props: {
    app,
    allowComments: {
      type: "boolean",
      label: "Allow comments",
      description: "Allow users to comment on the feed event.",
      optional: true,
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
      optional: true,
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
    externalId: {
      type: "string",
      label: "External ID",
      description: "A unique identifier for this event you can use to retrieve the event_id for the event using the Get Event Id By External Id endpoint.",
      optional: true,
    },
    notificationTitle: {
      type: "string",
      label: "Notification Title",
      description: "Title of push notification to be send to devices of recipients of this event.",
      optional: true,
    },
    notificationText: {
      type: "string",
      label: "Notification Text",
      description: "Body of push notification to be sent to devices of recipients of this event.",
      optional: true,
    },
  },
  async run({ $ }) {
    const sections = typeof this.sections === "string"
      ?
      JSON.parse(this.sections)
      :
      this.sections;

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
        external_id: this.externalId,
        notification_title: this.notificationTitle,
        notification_text: this.notificationText,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent post to feed with event ID \`${response.data.event_id}\``);
    }

    return response;
  },
};
