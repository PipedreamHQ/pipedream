import app from "../../basecamp.app.mjs";

export default {
  key: "basecamp-create-message",
  name: "Create Message",
  description: "Publishes a message in the project and message board selected. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/messages.md#create-a-message)",
  type: "action",
  version: "0.0.7",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
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
      description: "The body of the message. See [Rich text guide](https://github.com/basecamp/bc3-api/blob/master/sections/rich_text.md) for what HTML tags are allowed.",
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

    $.export("$summary", `Successfully posted message with ID ${message.id}`);
    return message;
  },
};
