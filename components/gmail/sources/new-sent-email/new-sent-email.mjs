import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../../common/verify-client-id.mjs";

export default {
  ...common,
  key: "gmail-new-sent-email",
  name: "New Sent Email",
  description: "Emit new event for each new email sent. (Maximum of 300 events emited per execution)",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    setLastMessageId(id) {
      this.db.set("lastMessageId", id);
    },
    getLastMessageId() {
      return this.db.get("lastMessageId");
    },
    emit(event) {
      this.$emit(event, {
        id: event.id,
        summary: event.snippet,
        ts: new Date(event.internalDate),
      });
    },
  },
  async run() {
    let pageToken = null;
    let lastMessageId = this.getLastMessageId();
    let firstExecutionId = null;
    const promises = [];
    const MAX_MESSAGES = 300;
    loop1:
    while (true) {
      const res = await this.gmail.listMessages({
        labelIds: [
          "SENT",
        ],
        pageToken,
      });

      if (!firstExecutionId) {
        firstExecutionId = res.messages[0].id;
      }
      pageToken = res.nextPageToken;

      for (const message of res.messages) {
        if (message.id === lastMessageId) {
          break loop1;
        }
        promises.push(this.gmail.getMessage({
          id: message.id,
        }));
      }

      if (!pageToken || promises.length >= MAX_MESSAGES) {
        break;
      }
    }

    if (firstExecutionId) {
      this.setLastMessageId(firstExecutionId);
    }

    const details = await Promise.all(promises);
    for (const detail of details.reverse()) {
      this.emit(detail);
    }
  },
};
