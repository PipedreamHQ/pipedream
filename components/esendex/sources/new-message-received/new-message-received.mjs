import esendex from "../../esendex.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "esendex-new-message-received",
  name: "New Message Received",
  description: "Emit new event when a new message is received. [See the documentation[(https://developers.esendex.com/api-reference/#messageheader)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    esendex,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the messages to watch for: either SMS or Voice. If no type is specified, the default is SMS.",
      options: constants.MESSAGE_TYPES,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter messages by status. If no status is specified, all statuses are returned.",
      options: constants.MESSAGE_STATUSES,
      optional: true,
    },
  },
  methods: {
    _getLastTs() {
      return this.$db.get("lastTs");
    },
    _setLastTs(ts) {
      this.$db.set("lastTs", ts);
    },
    generateMeta(message) {
      return {
        id: message.reference,
        summary: `New Message Received: ${message.reference}`,
        ts: Date.parse(message.laststatusat),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const { messageheaders } = await this.esendex.listMessages({
        params: {
          start: lastTs,
          finish: new Date().toISOString()
            .split(".")[0] + "Z", // current time
          type: this.type,
          status: this.status,
        },
      });

      let count = 0;
      for (const message of messageheaders) {
        if (!lastTs || Date.parse(message.laststatusat) > Date.parse(lastTs)) {
          const meta = this.generateMeta(message);
          this.$emit(message, meta);
          if (!maxTs || Date.parse(message.laststatusat) > Date.parse(maxTs)) {
            maxTs = message.laststatusat;
          }
          if (max && ++count >= max) {
            break;
          }
        }
      }

      this._setLastTs(maxTs);
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
