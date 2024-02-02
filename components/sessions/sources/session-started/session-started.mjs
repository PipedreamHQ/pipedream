import { axios } from "@pipedream/platform";
import sessions from "../../sessions.app.mjs";

export default {
  key: "sessions-session-started",
  name: "Session Started",
  description: "Emits an event when a session starts. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sessions,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    endedAt: {
      propDefinition: [
        sessions,
        "endedAt",
      ],
    },
  },
  methods: {
    async getSessionsStartedSince(since) {
      const sessions = await this.sessions.getSessionsStarted({
        endedAt: since,
      });
      return sessions;
    },
    generateMeta(session) {
      return {
        id: session.id,
        summary: `Session started: ${session.name}`,
        ts: new Date(session.startAt).getTime(),
      };
    },
  },
  hooks: {
    async deploy() {
      // Emit at most 50 events in order of most recent to least recent
      const sessionsStarted = await this.getSessionsStartedSince(new Date().toISOString());
      sessionsStarted.slice(0, 50).forEach((session) => {
        const meta = this.generateMeta(session);
        this.$emit(session, meta);
      });
      this.db.set("lastEmitted", new Date().toISOString());
    },
  },
  async run() {
    // Retrieve all sessions that have started since the last time the source ran
    const lastEmitted = this.db.get("lastEmitted") || new Date().toISOString();
    const sessionsStarted = await this.getSessionsStartedSince(lastEmitted);

    sessionsStarted.forEach((session) => {
      const meta = this.generateMeta(session);
      this.$emit(session, meta);
    });

    // Update the `lastEmitted` time to the current time
    this.db.set("lastEmitted", new Date().toISOString());
  },
};
