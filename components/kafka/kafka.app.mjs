import { Kafka } from "kafkajs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "kafka",
  propDefinitions: {
    topic: {
      type: "string",
      label: "Topic",
      description: "The topic to interact with.",
      options() {
        return this.listTopics();
      },
    },
  },
  methods: {
    getBrokers() {
      const {
        host,
        port,
      } = this.$auth;
      return [
        `${host}:${port}`,
      ];
    },
    getClient() {
      return new Kafka({
        clientId: "Pipedream",
        brokers: this.getBrokers(),
      });
    },
    getApiClient(api, config) {
      return this.getClient()[api](config);
    },
    async withApi(fn, api = constants.API.ADMIN, config) {
      const apiClient = this.getApiClient(api, config);
      await apiClient.connect();
      try {
        return await fn(apiClient);
      } finally {
        await apiClient.disconnect();
      }
    },
    listTopics() {
      return this.withApi((admin) => admin.listTopics());
    },
    listGroups() {
      return this.withApi((admin) => admin.listGroups());
    },
    createTopics(args = {}) {
      return this.withApi((admin) => admin.createTopics(args));
    },
    deleteTopics(args = {}) {
      return this.withApi((admin) => admin.deleteTopics(args));
    },
    deleteGroups(args = {}) {
      return this.withApi((admin) => admin.deleteGroups(args));
    },
    sendMessages(args = {}) {
      return this.withApi((producer) => producer.send(args), constants.API.PRODUCER);
    },
    async messageListener({
      topic, fromBeginning = true, onMessage, groupId,
    } = {}) {
      const config = {
        groupId,
      };
      const consumer = this.getApiClient(constants.API.CONSUMER, config);
      await consumer.connect();
      await consumer.subscribe({
        topic,
        fromBeginning,
      });
      await consumer.run({
        eachMessage: onMessage,
      });
      return consumer;
    },
  },
};
