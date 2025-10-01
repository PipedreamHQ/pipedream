import constants from "../../common/constants.mjs";
import app from "../../plivo.app.mjs";

export default {
  key: "plivo-send-mms",
  name: "Send MMS",
  description: "Sends an MMS message to a phone number. [See the docs](https://www.plivo.com/docs/sms/api/message#send-a-message).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    src: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      label: "Source",
      description: "The source number to send the MMS from. This number should be rented from Plivo.",
    },
    dst: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      label: "Destination",
      description: "The destination number to send the MMS to.",
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description: "The URLs of the media to send with the MMS message.",
    },
  },
  async run({ $: step }) {
    const {
      src,
      dst,
      text,
      mediaUrls,
    } = this;

    const response = await this.app.sendMessage([
      {
        src,
        dst,
        text,
        media_urls: mediaUrls,
        type: constants.RESOURCE.MSG.TYPE.MMS,
      },
    ]);

    step.export("$summary", "Successfully queued MMS message");

    return response;
  },
};
