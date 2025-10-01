import { v4 as uuid } from "uuid";
import amqp from "../../amqp.app.mjs";

export default {
  key: "amqp-send-message",
  name: "Send a Message",
  description: "Send a new message to an [AMQP 1.0](https://www.amqp.org/sites/amqp.org/files/amqp.pdf) queue. [See the library example here](https://github.com/amqp/rhea-promise#sending-a-message-via-awaitablesender).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        message_id: uuid(),
      });

      $.export("$summary", `Sucessfully sent message with Delivery ID ${delivery.id}`);

    } catch (error) {
      console.log("Error sending message", JSON.stringify(error.innerError));
      throw error;

    } finally {
      await this.amqp.close(sender);
      await this.amqp.close(connection);
    }
  },
};
