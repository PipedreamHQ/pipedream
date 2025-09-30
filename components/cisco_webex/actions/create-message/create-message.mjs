import ciscoWebex from "../../cisco_webex.app.mjs";

export default {
  key: "cisco_webex-create-message",
  name: "Create Message",
  description: "Post a plain text or [rich text](https://developer.webex.com/docs/basics#formatting-messages) message, and optionally, a [file attachment](https://developer.webex.com/docs/basics#message-attachments), to a room. [See the docs here](https://developer.webex.com/docs/api/v1/messages/create-a-message)",
  type: "action",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ciscoWebex,
    text: {
      type: "string",
      label: "Text",
      description: "The message, in plain text. If markdown is specified this parameter may be optionally used to provide alternate text for UI clients that do not support rich text. The maximum message length is 7439 bytes.",
    },
    markdown: {
      type: "string",
      label: "Markdown",
      description: "The message, in Markdown format. The maximum message length is 7439 bytes.",
      optional: true,
    },
    toPersonId: {
      propDefinition: [
        ciscoWebex,
        "personId",
      ],
      optional: true,
    },
    toPersonEmail: {
      type: "string",
      label: "To Person Email",
      description: "The email address of the recipient when sending a private 1:1 message.",
      optional: true,
    },
    roomId: {
      optional: true,
      propDefinition: [
        ciscoWebex,
        "roomId",
      ],
    },
    parentId: {
      optional: true,
      propDefinition: [
        ciscoWebex,
        "messageId",
        ({ roomId }) => ({
          roomId,
        }),
      ],
    },
    file: {
      type: "string",
      label: "File",
      description: "The public URL to a binary file to be posted into the room. (E.g. `http://www.example.com/images/media.png`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      roomId,
      parentId,
      toPersonId,
      toPersonEmail,
      text,
      markdown,
      file,
    } = this;

    const files = file && [
      file,
    ] || undefined;

    const response =
      await this.ciscoWebex.createMessage({
        data: {
          roomId,
          parentId,
          toPersonId,
          toPersonEmail,
          text,
          markdown,
          files,
        },
      });

    $.export("$summary", `Successfully posted message with ID ${response.id}`);

    return response;
  },
};
