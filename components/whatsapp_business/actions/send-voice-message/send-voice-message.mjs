import whatsapp from "../../whatsapp_business.app.mjs";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "whatsapp_business-send-voice-message",
  name: "Send Voice Message",
  description: "Sends a voice message. [See the documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/audio-messages)",
  version: "0.0.1",
  type: "action",
  props: {
    whatsapp,
    phoneNumberId: {
      propDefinition: [
        whatsapp,
        "phoneNumberId",
      ],
    },
    recipientPhoneNumber: {
      propDefinition: [
        whatsapp,
        "recipientPhoneNumber",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a media file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The mime-type of media file being uploaded",
      options: [
        "audio/aac",
        "audio/mp4",
        "audio/mpeg",
        "audio/amr",
        "audio/ogg",
        "audio/opus",
      ],
    },
  },
  async run({ $ }) {
    // upload media file
    const formData = new FormData();
    const content = fs.createReadStream(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`);
    formData.append("file", content);
    formData.append("type", this.type);
    formData.append("messaging_product", "whatsapp");
    const { id: mediaId } = await this.whatsapp.uploadMedia({
      $,
      phoneNumberId: this.phoneNumberId,
      data: formData,
      headers: formData.getHeaders(),
    });

    // send voice message
    const response = await this.whatsapp.sendVoiceMessage({
      $,
      phoneNumberId: this.phoneNumberId,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: this.recipientPhoneNumber,
        type: "audio",
        audio: {
          id: mediaId,
        },
      },
    });
    $.export("$summary", `Sent message successfully to +${this.recipientPhoneNumber}`);
    return response;
  },
};
