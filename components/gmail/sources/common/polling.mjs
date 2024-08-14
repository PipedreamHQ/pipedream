import common from "../../common/verify-client-id.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
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
  methods: {
    ...common.methods,
    getLastMessageId() {
      return this.db.get("lastMessageId");
    },
    setLastMessageId(lastMessageId) {
      this.db.set("lastMessageId", lastMessageId);
    },
    processMessageIds() {
      throw new Error("processMessageIds not implemented");
    },
    constructQuery() {
      return this.q;
    },
  },
  async run() {
    const {
      gmail,
      constructQuery,
      labels,
    } = this;

    console.log("Polling for new messages...");
    const { messages } = await gmail.listMessages({
      q: constructQuery(),
      labelIds: labels,
      maxResults: constants.HISTORICAL_EVENTS,
    });

    let messageIds = messages?.map((message) => message.id);

    if (!messageIds?.length) {
      console.log("There are no new messages. Exiting...");
      return;
    }

    const lastMessageId = this.getLastMessageId();
    if (lastMessageId !== messageIds[0]) {
      this.setLastMessageId(messageIds[0]);
    }

    const index = messageIds.indexOf(lastMessageId);
    if (index !== -1) {
      messageIds = messageIds.slice(0, index);
    }

    const numMessages = messageIds.length;
    if (!numMessages) {
      console.log("Messages already processed. Exiting...");
      return;
    }

    const suffix = numMessages === 1
      ? ""
      : "s";
    console.log(`Received ${numMessages} new message${suffix}. Please be patient while more information for each message is being fetched.`);
    await this.processMessageIds(messageIds.reverse());
  },
};
