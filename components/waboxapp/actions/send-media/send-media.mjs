import waboxapp from "../../waboxapp.app.mjs";

export default {
  key: "waboxapp-send-media",
  name: "Send Media",
  description: "Send any kind of file in WhatsApp to a specific phone number. [See the documentation](https://www.waboxapp.com/assets/doc/waboxapp-API-v3.pdf)",
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
      label: "File URL",
      description: "URL of the file to send",
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
    urlThumb: {
      propDefinition: [
        waboxapp,
        "urlThumb",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.waboxapp.sendMedia({
      $,
      data: {
        uid: this.uid,
        to: this.to,
        custom_uid: this.customUid,
        url: this.url,
        caption: this.caption,
        description: this.description,
        url_thumb: this.urlThumb,
      },
    });

    $.export("$summary", `Successfully sent media file to ${this.to}`);
    return response;
  },
};
