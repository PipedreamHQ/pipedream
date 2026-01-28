import app from "../../clicksend.app.mjs";

export default {
  key: "clicksend-send-mms",
  name: "Send MMS",
  description: "Sends a new MMS to one or multiple recipients. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#send-mms)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      optional: false,
      propDefinition: [
        app,
        "to",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the MMS.",
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
    },
    mediaFile: {
      type: "string",
      label: "Media File URL",
      description: "The URL to the media file you want to send via MMS. Eg `http://yourdomain.com/tpLaX6A.gif`",
    },
  },
  methods: {
    sendMms(args = {}) {
      return this.app.post({
        path: "/mms/send",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendMms,
      from,
      body,
      to,
      mediaFile,
      subject,
    } = this;

    const response = await sendMms({
      $,
      data: {
        media_file: mediaFile,
        messages: [
          {
            from,
            to,
            subject,
            body,
          },
        ],
      },
    });

    $.export("$summary", `Successfully sent MMS with ID \`${response.data.messages[0].message_id}\``);
    return response;
  },
};
