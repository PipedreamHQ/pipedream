import amqp from "../../amqp.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "amqp-receive-message",
  name: "New Message",
  description: "Emit new event for each new message in an [AMQP 1.0](https://www.amqp.org/sites/amqp.org/files/amqp.pdf) queue. [See the library example here](https://github.com/amqp/rhea-promise#receiving-a-message).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    amqp,
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "The timer to use to schedule the next poll.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
      const messages = await this.amqp.onMessageReceiver(receiver);

      messages.forEach((message, idx) => {
        const id = timestamp + idx;
        this.$emit(message, {
          id,
          ts: id,
          summary: `New Message ${message.message_id}`,
        });
      });

    } catch (error) {
      if (error.innerError) {
        console.log("Inner error", JSON.stringify(error.innerError));
      }
      throw error;

    } finally {
      await this.amqp.close(receiver);
      await this.amqp.close(connection);
    }
  },
};
