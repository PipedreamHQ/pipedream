import { getFileStreamAndMetadata } from "@pipedream/platform";
import app from "../../signal.app.mjs";

export default {
  key: "signal-send-message",
  name: "Send Message",
  description: "Send a Signal message to one or more recipients. [See the documentation](https://bbernhard.github.io/signal-cli-rest-api/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    textMode: {
      propDefinition: [
        app,
        "textMode",
      ],
    },
    recipients: {
      propDefinition: [
        app,
        "recipients",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "File paths (e.g. `/tmp/file.pdf`) or URLs to attach to the message. Files will be base64-encoded and sent with their detected MIME type and filename.",
      format: "file-ref",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  methods: {
    async buildBase64Attachment(filePath) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(filePath);

      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const base64 = Buffer.concat(chunks).toString("base64");

      const mimeType = metadata.contentType || "application/octet-stream";
      const filename = metadata.name || filePath.split("/").pop()
        .split("?")[0];

      // Format: data:<MIME-TYPE>;filename=<FILENAME>;base64,<BASE64 ENCODED DATA>
      return `data:${mimeType};filename=${filename};base64,${base64}`;
    },
  },
  async run({ $ }) {
    const {
      phoneNumber,
      recipients,
      message,
      textMode,
      attachments,
    } = this;

    const base64Attachments = attachments?.length
      ? await Promise.all(attachments.map((f) => this.buildBase64Attachment(f)))
      : [];

    const response = await this.app.sendMessage({
      $,
      data: {
        number: phoneNumber,
        recipients,
        message,
        text_mode: textMode,
        ...(base64Attachments.length && {
          base64_attachments: base64Attachments,
        }),
      },
    });

    $.export("$summary", "Successfully sent message.");
    return response;
  },
};
