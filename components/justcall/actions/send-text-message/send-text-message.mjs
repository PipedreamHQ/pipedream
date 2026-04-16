import app from "../../justcall.app.mjs";

export default {
  key: "justcall-send-text-message",
  name: "Send Text Message",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send a text from your JustCall SMS capabled number. [See the documentation](https://justcall.io/developer-docs/#send_text)",
  type: "action",
  props: {
    app,
    justcallNumber: {
      propDefinition: [
        app,
        "from",
      ],
      label: "JustCall Number",
      description: "JustCall number using which the SMS is to be sent. Please follow the E.164 number format (+141555XXXXX).",
    },
    body: {
      type: "string",
      label: "Body",
      description: "Enter the content to be sent in the SMS. Maximum character limit for message is 1600.",
    },
    contactNumber: {
      type: "string",
      label: "Contact Number",
      description: "Number of the contact with country code to which SMS is to be sent. Please follow the E.164 number format.",
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "Maximum 10 public links of the media having MIME type should not exceed the cumulative size of 5 MB",
      optional: true,
      options: [
        "image/jpeg",
        "image/gif",
        "image/x-png",
        "image/png",
        "image/vnd.wap.wbmp",
        "image/x-bmp",
        "audio/amr",
        "audio/x-amr",
        "audio/x-wav",
        "audio/midi",
        "audio/mid",
        "audio/x-midi",
        "audio/sp-midi",
        "audio/rmf",
        "audio/x-rmf",
        "audio/x-beatnik-rmf",
        "audio/basic",
        "audio/mp3",
        "video/3gpp",
        "video/mp4",
        "application/mp4",
        "image/mp4",
        "text/mp4",
        "audio/mp4",
        "text/vcard",
        "text/csv",
        "text/rtf",
        "text/richtext",
        "text/calendar",
        "text/directory",
        "application/pdf",
      ],
    },
    restrictOnce: {
      type: "string",
      label: "Restrict Once",
      description: "Set value to Yes to prevent the SMS from being sent to the same receiver in 24 hours. Default value is set to No and allows same SMS to be sent multiple times in 24 hours to the same contact.",
      options: [
        "Yes",
        "No",
      ],
      optional: true,
    },
    scheduleAt: {
      type: "string",
      label: "Schedule At",
      description: "Enter the date and time (`YYYY-MM-DD HH:mm:ss`) at which the SMS is to be sent. In case no value is sent, the SMS will be sent out immediately when the API call is made.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      justcallNumber,
      body,
      contactNumber,
      mediaUrl,
      restrictOnce,
      scheduleAt,
    } = this;

    const response = await app.sendTextMessage({
      $,
      data: {
        justcall_number: justcallNumber,
        body,
        contact_number: contactNumber,
        media_url: typeof mediaUrl === "string"
          ? mediaUrl
          : Array.isArray(mediaUrl)
            ? mediaUrl.join(",")
            : undefined,
        restrict_once: restrictOnce,
        schedule_at: scheduleAt,
      },
    });

    $.export("$summary", `A new text message with Id: ${response.id} was successfully sent!`);
    return response;
  },
};
