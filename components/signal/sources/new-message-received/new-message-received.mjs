import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../signal.app.mjs";

export default {
  key: "signal-new-message-received",
  name: "New Message Received",
  description: "Emit new event for each Signal message received on the configured phone number. [See the documentation](https://bbernhard.github.io/signal-cli-rest-api/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll for new messages",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    timeout: {
      propDefinition: [
        app,
        "timeout",
      ],
    },
    ignoreAttachments: {
      propDefinition: [
        app,
        "ignoreAttachments",
      ],
    },
    ignoreStories: {
      propDefinition: [
        app,
        "ignoreStories",
      ],
    },
    sendReadReceipts: {
      propDefinition: [
        app,
        "sendReadReceipts",
      ],
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    generateMeta(message, ts) {
      const id = `${ts}-${JSON.stringify(message).length}`;
      const sender = message?.envelope?.source || message?.envelope?.sourceNumber || "unknown";
      const text = message?.envelope?.dataMessage?.message || "New Signal message";
      return {
        id,
        summary: `New message from ${sender}: ${text.substring(0, 50)}`,
        ts,
      };
    },
  },
  async run() {
    const {
      phoneNumber,
      timeout,
      ignoreAttachments,
      ignoreStories,
      sendReadReceipts,
    } = this;

    const messages = await this.app.receiveMessages({
      phoneNumber,
      params: {
        timeout,
        ignore_attachments: ignoreAttachments,
        ignore_stories: ignoreStories,
        send_read_receipts: sendReadReceipts,
      },
    });

    if (!messages?.length) {
      return;
    }

    const lastTimestamp = this._getLastTimestamp();
    let maxTimestamp = lastTimestamp;

    const newMessages = messages.filter((msg) => {
      const ts = msg?.envelope?.timestamp || 0;
      return ts > lastTimestamp;
    });

    newMessages.forEach((msg) => {
      const ts = msg?.envelope?.timestamp || Date.now();
      if (ts > maxTimestamp) {
        maxTimestamp = ts;
      }
      const meta = this.generateMeta(msg, ts);
      this.$emit(msg, meta);
    });

    if (maxTimestamp > lastTimestamp) {
      this._setLastTimestamp(maxTimestamp);
    }
  },
};
