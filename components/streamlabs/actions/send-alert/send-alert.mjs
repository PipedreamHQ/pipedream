import streamlabs from "../../streamlabs.app.mjs";

export default {
  key: "streamlabs-send-alert",
  name: "Send Alert",
  description: "Sends an alert to the stream overlay with a custom message, image, and sound. [See the documentation](https://dev.streamlabs.com/reference/alerts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streamlabs,
    type: {
      type: "string",
      label: "Type",
      description: "determines which alert box this alert will show up in",
      options: [
        "follow",
        "subscription",
        "donation",
        "host",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to show with this alert",
    },
    imageHref: {
      type: "string",
      label: "Image HREF",
      description: "The href pointing to an image resource to play when this alert shows",
      optional: true,
    },
    soundHref: {
      type: "string",
      label: "Sound HREF",
      description: "The href pointing to a sound resource to play when this alert shows",
      optional: true,
    },
    userMessage: {
      type: "string",
      label: "User Message",
      description: "Acting as the second heading, this shows below message",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "How many seconds this alert should be displayed. Value should be in milliseconds. Ex: `1000` for 1 second.",
      optional: true,
    },
    specialTextColor: {
      type: "string",
      label: "Special Text Color",
      description: "The color to use for special tokens. Must be a valid CSS color string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.streamlabs.sendAlert({
      $,
      data: {
        type: this.type,
        message: this.message,
        image_href: this.imageHref,
        sound_href: this.soundHref,
        user_message: this.userMessage,
        duration: this.duration,
        special_text_color: this.specialTextColor,
      },
    });
    $.export("$summary", `Alert sent with message: ${this.message}`);
    return response;
  },
};
