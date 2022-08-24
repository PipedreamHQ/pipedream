import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "gmail-new-email",
  name: "New Email",
  description: "Emit new event when an email is received. This source is capped at 100 max new messages per run.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    q: {
      propDefinition: [
        common.props.gmail,
        "q",
      ],
    },
    labels: {
      propDefinition: [
        common.props.gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      console.log(`Fetching last ${constants.HISTORICAL_EVENTS} historical events...`);
      const response = await this.gmail.listMessages({
        q: this.q,
        labelIds: this.labels,
        maxResults: constants.HISTORICAL_EVENTS,
      });

      const messageIds = response?.messages?.map((message) => message.id);
      this.setLastMessageId(messageIds[0]);
      const messages = await this.getMessages(messageIds.reverse());
      this.emitEvents(messages);
    },
  },
  methods: {
    ...common.methods,
    async getMessages(ids = []) {
      const promises = ids.map((id) => this.gmail.getMessage({
        id,
      }));
      return Promise.all(promises);
    },
    generateMeta(message) {
      const { value: subject } = message.payload.headers.find(({ name }) => name === "Subject");
      return {
        id: message.id,
        summary: `New email: ${subject}`,
        ts: message.internalDate,
      };
    },
    emitEvents(messages) {
      for (const message of messages) {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      }
    },
  },
  async run() {
    const lastMessageId = this.getLastMessageId();

    const response = await this.gmail.listMessages({
      q: this.q,
      labelIds: this.labels,
      maxResults: 100,
    });

    let messageIds = response?.messages?.map((message) => message.id);
    this.setLastMessageId(messageIds[0]);
    const index = messageIds.indexOf(lastMessageId);
    if (index !== -1) {
      messageIds = messageIds.slice(0, index);
    }

    const numMessages = messageIds.length;
    if (!numMessages) {
      console.log("No new message. Exiting...");
      return;
    }

    const suffix = numMessages === 1
      ? ""
      : "s";
    console.log(`Received ${numMessages} new message${suffix}. Please be patient while more information for each message is being fetched.`);
    const messages = await this.getMessages(messageIds.reverse());
    this.emitEvents(messages);
  },
};
