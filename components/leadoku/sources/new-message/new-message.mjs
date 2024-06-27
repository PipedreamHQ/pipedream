import { axios } from "@pipedream/platform";
import leadoku from "../../leadoku.app.mjs";

export default {
  type: "source",
  key: "leadoku-new-message",
  name: "New Message",
  description: "Emits an event each time a new message appears in the Leadoku inbox",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    leadoku,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getCursor() {
      return this.db.get("cursor") || null;
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
  },
  async run() {
    const lastCursor = this._getCursor();
    let newCursor = null;
    let done = false;

    while (!done) {
      const { data: messages } = await this.leadoku._makeRequest({
        method: "GET",
        path: "/messages",
        params: {
          after: lastCursor,
        },
      });

      if (!messages.length) {
        console.log("No new messages.");
        break;
      }

      for (const message of messages) {
        this.$emit(message, {
          id: message.id,
          summary: `New message from ${message.sender}: ${message.content}`,
          ts: new Date(message.timestamp).getTime(),
        });

        newCursor = message.id;
      }

      if (messages.length < 100) {
        done = true;
      }
    }

    if (newCursor) {
      this._setCursor(newCursor);
    }
  },
};
