import waboxapp from "../../waboxapp.app.mjs";

export default {
  key: "waboxapp-send-image",
  name: "Send Image",
  description: "Send an image in WhatsApp to a specific phone number. [See the documentation](https://www.waboxapp.com/assets/doc/waboxapp-API-v3.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    waboxapp,
    uid: {
      propDefinition: [
        waboxapp,
        "uid",
      ],
    },
    to: {
      propDefinition: [
        waboxapp,
        "to",
      ],
    },
    customUid: {
      propDefinition: [
        waboxapp,
        "customUid",
      ],
    },
    url: {
      propDefinition: [
        waboxapp,
        "url",
      ],
      label: "Image URL",
      description: "URL of the image to send",
    },
    caption: {
      propDefinition: [
        waboxapp,
        "caption",
      ],
    },
    description: {
      propDefinition: [
        waboxapp,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.waboxapp.sendImage({
      $,
      data: {
        uid: this.uid,
        to: this.to,
        custom_uid: this.customUid,
        url: this.url,
        caption: this.caption,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully sent image to ${this.to}`);
    return response;
  },
};
