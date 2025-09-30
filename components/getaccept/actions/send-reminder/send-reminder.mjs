import getaccept from "../../getaccept.app.mjs";

export default {
  key: "getaccept-send-reminder",
  name: "Send Reminder",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send a manual reminder for a document. [See the documentation](https://app.getaccept.com/api/#sendreminder).",
  type: "action",
  props: {
    getaccept,
    documentId: {
      propDefinition: [
        getaccept,
        "documentId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of reminder to send.",
      options: [
        "email",
        "sms",
        "video",
      ],
      default: "email",
    },
    notOpened: {
      type: "boolean",
      label: "Not Opened",
      description: "This reminder will be sent if the recipients haven't opened the document.",
      optional: true,
    },
    notSigned: {
      type: "boolean",
      label: "Not Signed",
      description: "This reminder will be sent if the recipients haven't signed the document.",
      optional: true,
    },
    videoId: {
      type: "string",
      label: "Video Id",
      description: "Only when using video reminders. Use an existing or [upload a video](https://app.getaccept.com/api/#uploadvideo) and use the received video_id.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the reminder email. Can contain merge tags.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      getaccept,
      documentId,
      notOpened,
      notSigned,
      videoId,
      ...data
    } = this;

    const response = await getaccept.sendReminder({
      $,
      documentId,
      data: {
        not_opened: notOpened,
        not_signed: notSigned,
        video_id: videoId,
        ...data,
      },
    });

    $.export("$summary", "Reminder was successfully sent!");
    return response;
  },
};
