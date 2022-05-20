import {
  Connection, ReceiverEvents,
} from "rhea-promise";

export default {
  key: "amqp-receive-message",
  name: "New Message",
  description: "Emit new event for each new message in an AMQP queue",
  type: "source",
  version: "0.0.1",
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
    receiverName: {
      type: "string",
      label: "Receiver Name",
      description: "The name of the receiver. e.g. (`my-receiver`)",
    },
    queueName: {
      type: "string",
      label: "Queue Name",
      description: "The name of the queue to send the message to.",
    },
  },
  hooks: {
    async deploy() {
    },
    async activate() {
    },
    async deactivate() {
    },
  },
  methods: {
    async openConnection({
      host, ...args
    } = {}) {
      const connection = new Connection({
        transport: "tls",
        reconnect: false,
        host,
        hostname: host,
        ...args,
      });
      return connection.open();
    },
    async closeConnection(connection) {
      return connection.close();
    },
    async createReceiver({
      connection, ...args
    } = {}) {
      return connection.createReceiver(args);
    },
    async onMessageReceiver(receiver) {
      return new Promise((resolve, reject) => {
        receiver.on(ReceiverEvents.message, (context) => {
          resolve(context.message);
        });

        receiver.on(ReceiverEvents.receiverError, (context) => {
          reject(context.receiver?.error ?? "Unknown Message Error");
        });

        setTimeout(() => {
          reject("Timeout Error");
        }, 120000);
      });
    },
    async closeReceriver(receiver) {
      return receiver.close();
    },
  },
  async run() {
    const {
      host,
      port,
      username,
      password,
      receiverName,
      queueName,
    } = this;
    const connection = await this.openConnection({
      host,
      port,
      username,
      password,
    });

    const receiver = await this.createReceiver({
      connection,
      name: receiverName,
      source: {
        address: queueName,
      },
      onSessionError: (context) => {
        throw context.session.error ?? "Unknown Session Error";
      },
    });

    const message = await this.onMessageReceiver(receiver);
    this.$emit(message, {
      id: 1,
      ts: new Date(),
      summary: "New Message",
    });
  },
};
