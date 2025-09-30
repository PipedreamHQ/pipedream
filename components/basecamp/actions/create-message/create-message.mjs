import app from "../../basecamp.app.mjs";
import common from "../../common/common.mjs";

export default {
  key: "basecamp-create-message",
  name: "Create Message",
  description: "Creates a message in a selected message board. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/messages.md#create-a-message)",
  type: "action",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    messageBoardId: {
      propDefinition: [
        app,
        "messageBoardId",
        ({
          accountId,
          projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The title of the message.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The body of the message. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/messages.md#create-a-message) for information on using HTML tags.",
      optional: true,
    },
    messageTypeId: {
      propDefinition: [
        app,
        "messageTypeId",
        ({
          accountId,
          projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      projectId,
      messageBoardId,
      content,
      subject,
      messageType,
    } = this;

    const message = await this.app.createMessage({
      $,
      accountId,
      projectId,
      messageBoardId,
      data: {
        content,
        subject,
        category_id: messageType,
        status: "active",
      },
    });

    $.export("$summary", `Successfully posted message (ID: ${message.id})`);
    return message;
  },
};
