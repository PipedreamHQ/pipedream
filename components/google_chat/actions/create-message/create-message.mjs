import app from "../../google_chat.app.mjs";
import {
  getFileStreamAndMetadata, ConfigurationError,
} from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "google_chat-create-message",
  name: "Create Message",
  description: "Create a message to post a text or an attachment. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.messages/create)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to create",
      optional: true,
    },
    attachment: {
      type: "string",
      label: "Attachment",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    async uploadAttachment($) {
      const form = new FormData();

      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.attachment);

      form.append(
        "metadata",
        JSON.stringify({
          filename: metadata.name,
        }),
        {
          contentType: "application/json",
        },
      );

      form.append(
        "media",
        stream,
        {
          filename: metadata.name,
        },
      );

      return this.app.uploadFile({
        $,
        spaceId: this.spaceId,
        data: form,
        headers: form.getHeaders(),
      });
    },
  },
  async run({ $ }) {
    if (!this.text && !this.attachment) {
      throw new ConfigurationError("At least one of 'Message Text' or 'Attachment' should be added");
    }

    let attachment;
    if (this.attachment) {
      attachment = await this.uploadAttachment($);
    }

    const response = await this.app.createMessage({
      $,
      text: this.text,
      spaceId: this.spaceId,
      data: {
        text: this.text,
        attachment,
      },
    });

    $.export("$summary", `Successfully created message "${response.name}"`);
    return response;
  },
};
