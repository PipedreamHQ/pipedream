import amqp from "../../amqp.app.mjs";

export default {
  key: "amqp-send-message",
  name: "Send a Message",
  description: "Send a new message to an AMQP 1.0 queue",
  version: "0.0.1",
  type: "action",
  props: {
    amqp,
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "The name of the sender. e.g. (`my-sender`)",
    },
    queueName: {
      propDefinition: [
        amqp,
        "queueName",
      ],
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message to send.",
    },
    body: {
      type: "string",
      label: "Message",
      description: "The message to send.",
    },
  },
  async run({ $ }) {
    const {
      host,
      port,
      username,
      password,
    } = this.amqp.$auth;

    const {
      senderName,
      queueName,
      messageId,
      body,
    } = this;

    const connection = await this.amqp.openConnection({
      host,
      port,
      username,
      password,
    });

    const sender = await this.amqp.createSender({
      connection,
      name: senderName,
      target: {
        address: queueName,
      },
      sendTimeoutInSeconds: 10,
    });

    try {
      const delivery = await this.amqp.sendMessage({
        sender,
        body,
        message_id: messageId,
      });

      $.export("$summary", `Sucessfully sent message with Delivery ID ${delivery.id}`);

    } catch (error) {
      console.log("Error sending message", JSON.stringify(error.innerError));

    } finally {
      await this.amqp.close(sender);
      await this.amqp.close(connection);
    }
  },
};
