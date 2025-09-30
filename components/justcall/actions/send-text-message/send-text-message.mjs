import justcall from "../../justcall.app.mjs";

export default {
  key: "justcall-send-text-message",
  name: "Send Text Message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send a text from your JustCall SMS capabled number. [See the documentation](https://justcall.io/developer-docs/#send_text)",
  type: "action",
  props: {
    justcall,
    from: {
      propDefinition: [
        justcall,
        "from",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Content of the text message.",
    },
    to: {
      type: "string",
      label: "To",
      description: "Phone number of the contact with country code.",
    },
    mediaUrl: {
      type: "string[]",
      label: "Media URL",
      description: "Maximum 5 public link of the media having MIME type mentioned [here](https://justcall.io/developer-docs/#send_text) & should not exceed the cummulative size of 5 MB.",
      optional: true,
    },
    once: {
      type: "boolean",
      label: "Once",
      description: "Pevents you from sending the same message to the same receiver in past 24 hours.",
      default: false,
    },
    import: {
      type: "string",
      label: "Import",
      description: "Prevents triggers.",
      options: [
        {
          label: "Default",
          value: "0",
        },
        {
          label: "Prevents integration and webhooks from getting triggered.",
          value: "1",
        },
        {
          label: "Prevents integrations from getting triggered (Webhooks will be triggered).",
          value: "2",
        },
      ],
      default: "0",
    },
  },
  async run({ $ }) {
    const {
      justcall,
      mediaUrl,
      ...data
    } = this;

    const response = await justcall.sendTextMessage({
      $,
      data: {
        ...data,
        media_url: mediaUrl && mediaUrl.toString(),
      },
    });

    $.export("$summary", `A new text message with Id: ${response.id} was successfully sent!`);
    return response;
  },
};
