import amqp from "../../amqp.app.mjs";

export default {
  key: "amqp-receive-message",
  name: "New Message",
  description: "Emit new event for each new message in an [AMQP 1.0](https://www.amqp.org/sites/amqp.org/files/amqp.pdf) queue. [See the library example here](https://github.com/amqp/rhea-promise#receiving-a-message).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    amqp,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    receiverName: {
      type: "string",
      label: "Receiver Name",
      description: "The name of the receiver. e.g. (`my-receiver`)",
    },
    queueName: {
      propDefinition: [
        amqp,
        "queueName",
      ],
    },
  },
  async run(event) {
    const { timestamp } = event;
    const {
      host,
      port,
      username,
      password,
    } = this.amqp.$auth;

    const {
      receiverName,
      queueName,
    } = this;

    console.log("Open connection");
    const connection = await this.amqp.openConnection({
      host,
      port,
      username,
      password,
    });

    console.log("Create receiver");
    const receiver = await this.amqp.createReceiver({
      connection,
      name: receiverName,
      source: {
        address: queueName,
      },
      onSessionError: (context) => {
        throw context.session.error ?? "Unknown Session Error";
      },
    });

    try {
      const message = await this.amqp.onMessageReceiver(receiver);

      const id = Date.parse(timestamp);

      this.$emit(message, {
        id,
        ts: id,
        summary: `New Message with ID ${message.message_id}`,
      });

    } catch (error) {
      console.log("Error receiving message", JSON.stringify(error.innerError));
      throw error;

    } finally {
      await this.amqp.close(receiver);
      await this.amqp.close(connection);
    }
  },
};
