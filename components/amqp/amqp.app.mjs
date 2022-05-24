import {
  Connection, ReceiverEvents,
} from "rhea-promise";

export default {
  type: "app",
  app: "amqp",
  propDefinitions: {
    queueName: {
      type: "string",
      label: "Queue Name",
      description: "The name of the queue to send the message to.",
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
    async createSender({
      connection, ...args
    }) {
      return connection.createAwaitableSender(args);
    },
    async sendMessage({
      sender, ...args
    }) {
      return sender.send(args);
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
          reject("Timeout Exception");
        }, 6000);
      });
    },
    // Where entity can be a connection, receiver, or sender object.
    async close(entity) {
      return entity.close();
    },
  },
};
