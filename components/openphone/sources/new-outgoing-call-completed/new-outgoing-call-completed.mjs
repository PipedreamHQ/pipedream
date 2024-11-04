import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-new-outgoing-call-completed",
  name: "New Outgoing Call Completed",
  description: "Emit new event when an outgoing call has ended. [See the documentation](https://www.openphone.com/docs/api-reference/calls/list-calls)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    openphone,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || new Date(0).toISOString();
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    async _getCompletedOutgoingCalls(createdAfter, maxResults) {
      const params = {
        createdAfter,
        maxResults,
      };
      const calls = await this.openphone._makeRequest({
        path: "/v1/calls",
        params,
      });
      return calls.filter((call) => call.status === "completed" && call.direction === "outgoing");
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const calls = await this._getCompletedOutgoingCalls(lastTimestamp, 50);

    calls.forEach((call) => {
      this.$emit(call, {
        id: call.id,
        summary: `Completed call with ${call.participants.join(", ")}`,
        ts: Date.parse(call.completedAt),
      });
    });

    if (calls.length > 0) {
      this._setLastTimestamp(calls[0].completedAt);
    }
  },
};
