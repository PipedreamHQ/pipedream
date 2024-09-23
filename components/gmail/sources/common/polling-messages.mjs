import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      const messageIds = await this.getMessageIds(constants.HISTORICAL_EVENTS);
      if (!messageIds?.length) {
        return;
      }
      await this.processHistoricalEvents(messageIds);
    },
  },
  methods: {
    ...common.methods,
    getLastDate() {
      return this.db.get("lastDate");
    },
    setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    constructQuery(lastDate) {
      const { q: query } = this;
      const after = !query?.includes("after:") && lastDate
        ? `after:${lastDate / 1000}`
        : "";
      return [
        after,
        query,
      ].join(" ").trim();
    },
    async getMessageIds(max, lastDate = 0) {
      console.log("Polling for new messages...");
      const { messages } = await this.gmail.listMessages({
        q: this.constructQuery(lastDate),
        labelIds: this.getLabels(),
        maxResults: max,
      });
      return messages?.map((message) => message.id);
    },
    async processMessageIds(messageIds, lastDate) {
      let maxDate = lastDate;
      const messages = this.gmail.getAllMessages(messageIds);
      for await (const message of messages) {
        if (message.internalDate >= lastDate) {
          this.emitEvent(message);
          maxDate = Math.max(maxDate, message.internalDate);
        }
      }
      if (maxDate) this.setLastDate(maxDate);
    },
    async processHistoricalEvents(messageIds) {
      let messages = await this.gmail.getMessages(messageIds);
      messages = messages.sort((a, b) => (a.internalDate - b.internalDate));
      this.setLastDate(messages[messages.length - 1].internalDate);
      messages.forEach((message) => this.emitEvent(message));
    },
  },
  async run() {
    const lastDate = this.getLastDate();
    const messageIds = await this.getMessageIds(constants.DEFAULT_LIMIT, lastDate);
    if (!messageIds?.length) {
      console.log("There are no new messages. Exiting...");
      return;
    }
    await this.processMessageIds(messageIds.reverse(), lastDate);
  },
};
