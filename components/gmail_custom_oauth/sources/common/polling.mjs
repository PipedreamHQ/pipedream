import gmail from "../../gmail_custom_oauth.app.mjs";
import constants from "../../../gmail/common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    gmail,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
    },
    labels: {
      propDefinition: [
        gmail,
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

      if (messageIds?.length) {
        this.setLastMessageId(messageIds[0]);
        await this.processMessageIds(messageIds.reverse());
      }
    },
  },
  methods: {
    getLastMessageId() {
      return this.db.get("lastMessageId");
    },
    setLastMessageId(lastMessageId) {
      if (lastMessageId) {
        this.db.set("lastMessageId", lastMessageId);
      }
    },
    processMessageIds() {
      throw new Error("processMessageIds not implemented");
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

    if (!messageIds?.length) {
      console.log("No new message. Exiting...");
      return;
    }

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
    await this.processMessageIds(messageIds.reverse());
  },
};
