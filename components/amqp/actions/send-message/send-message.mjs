import { Connection } from "rhea-promise";

export default {
  key: "amqp-send-message",
  name: "Send a Message",
  description: "Send a new message to an AMQP queue",
  version: "0.0.1",
  type: "action",
  props: {
    amqp: {
      type: "app",
      app: "amqp",
    },
    host: {
      type: "string",
      label: "Host",
      description: "The hostname of the AMQP broker. e.g. (`shark.rmq.cloudamqp.com`)",
    },
    port: {
      type: "integer",
      label: "Port",
      description: "The port of the AMQP broker. e.g. (`5672`)",
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the AMQP broker.",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the AMQP broker.",
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "The name of the sender. e.g. (`my-sender`)",
    },
    queueName: {
      type: "string",
      label: "Queue Name",
      description: "The name of the queue to send the message to.",
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
      senderName,
      queueName,
      messageId,
      body,
    } = this;

    const connection = new Connection({
      transport: "tls",
      host,
      hostname: host,
      username,
      password,
      port,
      reconnect: false,
    });

    await connection.open();

    const sender = await connection.createAwaitableSender({
      name: senderName,
      target: {
        address: queueName,
      },
      sendTimeoutInSeconds: 10,
    });

    const delivery = await sender.send({
      body,
      messageId,
    });

    $.export("$summary", `${connection.id} await sendMessage -> Delivery id: ${delivery.id}, settled: ${delivery.settled}`);

    await sender.close();
    await connection.close();
  },
};
