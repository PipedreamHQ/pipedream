import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import nevtanSign from "../../nevtan_sign.app.mjs";
import constants from "../../common/constants.mjs";

/**
 * Shared polling logic for every NevTan Sign source.
 *
 * NevTan Sign allows a single webhook URL per workspace, so sources never
 * register a webhook (doing so would overwrite the user's own). Instead each
 * run fetches `GET /envelopes`, compares every envelope's status with the
 * status stored on the previous run, and emits the ones the source cares about.
 *
 * The full `{ envelopeId: status }` map is stored (not just the last 100 IDs
 * that `dedupe: "unique"` remembers) because the list endpoint is unpaginated
 * and returns every envelope on every poll.
 */
export default {
  props: {
    nevtanSign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspaceId: {
      propDefinition: [
        nevtanSign,
        "workspaceId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEnvelopes();
    },
  },
  methods: {
    _getStatuses() {
      return this.db.get("statuses");
    },
    _setStatuses(statuses) {
      this.db.set("statuses", statuses);
    },
    /**
     * Whether to emit `envelope`. `previousStatus` is the status seen on the
     * previous poll, or `undefined` if the envelope has not been seen before.
     */
    isRelevant() {
      throw new Error("isRelevant is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    getTimestamp(envelope) {
      return Date.parse(envelope.updated_at || envelope.created_at) || Date.now();
    },
    getDedupeId(envelope) {
      const id = this.nevtanSign.getEnvelopeId(envelope);
      return `${id}-${envelope.status}-${this.getTimestamp(envelope)}`;
    },
    generateMeta(envelope) {
      return {
        id: this.getDedupeId(envelope),
        summary: this.getSummary(envelope),
        ts: this.getTimestamp(envelope),
      };
    },
    async processEnvelopes() {
      const envelopes = await this.nevtanSign.listEnvelopes({
        workspaceId: this.workspaceId,
      });

      const previous = this._getStatuses();
      const isFirstRun = !previous;
      const current = {};
      let toEmit = [];

      for (const envelope of envelopes) {
        const id = this.nevtanSign.getEnvelopeId(envelope);
        if (!id) {
          continue;
        }
        current[id] = envelope.status;
        if (this.isRelevant(envelope, previous?.[id])) {
          toEmit.push(envelope);
        }
      }

      // The API returns newest first. On the first run only a limited number
      // of existing envelopes are emitted, as sample events.
      if (isFirstRun) {
        toEmit = toEmit.slice(0, constants.MAX_HISTORICAL_EVENTS);
      }

      // Emit oldest first so events arrive in chronological order.
      toEmit.reverse().forEach((envelope) => {
        this.$emit(envelope, this.generateMeta(envelope));
      });

      this._setStatuses(current);
    },
  },
  async run() {
    await this.processEnvelopes();
  },
};
