import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-create-message",
  name: "Create Message",
  description: "Send a new message from a channel. [See the documentation](https://dev.frontapp.com/reference/create-message).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    frontApp,
    channelId: {
      propDefinition: [
        frontApp,
        "channelId",
      ],
    },
    to: {
      propDefinition: [
        frontApp,
        "to",
      ],
    },
    cc: {
      propDefinition: [
        frontApp,
        "cc",
      ],
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "Name used for the sender info of the message",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the message for email message",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the message",
    },
  },
  async run({ $ }) {
    // const {
    //   frontApp,
    //   name,
    //   teammateIds,
    // } = this;

    const data = {
      to: this.to,
      cc: this.cc,
      sender_name: this.senderName,
      subject: this.subject,
      body: this.body,
    };

    const response = await this.frontApp.createMessage({
      channelId: this.channelId,
      data,
      $,
    });

    $.export("$summary", `Successfully created message to the recipient: "${this.to}"`);
    return response;
  },
};
