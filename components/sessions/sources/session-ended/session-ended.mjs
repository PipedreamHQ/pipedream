import sessions from "../../sessions.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "sessions-session-ended",
  name: "Session Ended",
  description: "Emit new event when a session ends. Useful for data processing initiation. [See the documentation](https://api.app.sessions.us/api-docs/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sessions,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...sessions.methods,
    _getAfter(context) {
      return context.after || this.db.get("after") || null;
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
  hooks: {
    async deploy() {
      // Emit the last 50 ended sessions at most, in order of most recent to least recent
      const endedSessions = await this.sessions.getSessionsEnded({
        endedAt: new Date().toISOString(),
      });
      endedSessions
        .slice(0, 50)
        .reverse()
        .forEach((session) => {
          this.$emit(session, {
            id: session.id,
            summary: `Session ended: ${session.name}`,
            ts: Date.parse(session.endedAt),
          });
        });

      // Store the timestamp of the last emitted session
      const lastSession = endedSessions[0];
      if (lastSession) {
        this._setAfter(lastSession.endedAt);
      }
    },
  },
  async run() {
    // Fetch all ended sessions since the last run
    const after = this._getAfter();
    const endedSessions = await this.sessions.getSessionsEnded({
      endedAt: new Date().toISOString(),
    });

    endedSessions.forEach((session) => {
      const sessionEndedAt = Date.parse(session.endedAt);

      // Only process and emit events for sessions that ended after the last run
      if (after && sessionEndedAt <= after) return;

      this.$emit(session, {
        id: session.id,
        summary: `Session ended: ${session.name}`,
        ts: sessionEndedAt,
      });
    });

    // Update the stored timestamp
    if (endedSessions.length > 0) {
      const lastSession = endedSessions[0];
      this._setAfter(lastSession.endedAt);
    }
  },
};
