import whatsapp from "../../whatsapp_business.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "whatsapp_business-send-voice-message",
  name: "Send Voice Message",
  description: "Sends a voice message. [See the documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/audio-messages)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    // upload media file
    const formData = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
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
