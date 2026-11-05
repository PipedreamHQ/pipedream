import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import FormData from "form-data";
import app from "../../trengo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  type: "action",
  key: "trengo-send-a-ticket-media-message",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Send A Ticket Media Message",
  description: "Send a file to a ticket on a non-email channel, such as WhatsApp, live chat or social. For email tickets, use **Upload File** and pass the returned ID to **Send A Ticket Message**'s `Attachment IDs`. [See the documentation](https://developers.trengo.com/reference/send-media)",
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "A file URL or a path to a file in the `/tmp` directory (e.g. `/tmp/label.pdf`). Supported types include images, videos, audio, text, PDF and MS Office files (max 20 MB)",
      format: "file-ref",
    },
    caption: {
      type: "string",
      label: "Caption",
      description: "A caption to send with the file. Not shown on live chat or email tickets.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    const sizeMb = metadata.size / 1e6;
    if (sizeMb > constants.MAX_FILE_SIZE_MB) {
      stream.destroy();
      throw new ConfigurationError(`File is ${sizeMb.toFixed(1)} MB; Trengo accepts at most ${constants.MAX_FILE_SIZE_MB} MB.`);
    }

    const data = new FormData();
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    if (this.caption) {
      data.append("caption", this.caption);
    }

    const response = await this.app.sendTicketMediaMessage({
      $,
      ticketId: this.ticketId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Sent media message to ticket ${this.ticketId}`);
    return response;
  },
};
