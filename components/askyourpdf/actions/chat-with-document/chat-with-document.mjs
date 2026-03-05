import app from "../../askyourpdf.app.mjs";

export default {
  key: "askyourpdf-chat-with-document",
  name: "Chat With Document",
  description: "Chat with a document. [See the documentation](https://docs.askyourpdf.com/askyourpdf-docs/#3.-chat-endpoint)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    docId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document for the conversation.",
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "The sender of the chat message. The sender should be `user`.",
      default: "user",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The chat message content.",
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Flag for streaming. Default is false",
      optional: true,
      default: false,
    },
  },
  methods: {
    chatWithDocument({
      docId, ...args
    } = {}) {
      return this.app.post({
        path: `/chat/${docId}`,
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      chatWithDocument,
      docId,
      sender,
      message,
      stream,
    } = this;

    return chatWithDocument({
      step,
      docId,
      data: [
        {
          sender,
          message,
        },
      ],
      params: {
        stream,
      },
      summary: (response) => `Successfully chatted with document at: \`${response.created || (new Date()).toISOString()}\``,
    });
  },
};
