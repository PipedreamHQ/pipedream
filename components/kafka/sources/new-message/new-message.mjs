import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../kafka.app.mjs";

export default {
  key: "kafka-new-message",
  name: "New Message",
  description: "Emit new event when a message is published to a Kafka topic using a timer. [See the documentation](https://github.com/tulios/kafkajs).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    topic: {
      description: "The topic to listen for new messages on.",
      propDefinition: [
        app,
        "topic",
      ],
    },
  },
  methods: {
    delay(consumer, ms = 1000) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          await consumer.disconnect();
          console.log("Consumer disconnected!!!");
          resolve();
        }, ms);
      });
    },
  },
  async run() {
    console.log("Running ...");
    const {
      app,
      topic,
      delay,
    } = this;

    const GROUP_ID = "pipedream-group";

    await app.deleteGroups([
      GROUP_ID,
    ]);

    const consumer = await app.messageListener({
      topic,
      groupId: GROUP_ID,
      onMessage: (record) => {
        const { message } = record;
        this.$emit({
          ...record,
          msgValue: message.value.toString(),
          msgKey: message.key?.toString(),
        }, {
          id: `${message.key}-${message.offset}-${message.timestamp}`,
          summary: `New Message ${message.timestamp}`,
          ts: Date.parse(message.timestamp),
        });
      },
    });

    await delay(consumer);
  },
};
