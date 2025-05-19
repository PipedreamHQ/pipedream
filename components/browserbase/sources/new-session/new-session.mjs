import { axios } from "@pipedream/platform";
import browserbase from "../../browserbase.app.mjs";

export default {
  key: "browserbase-new-session",
  name: "New Session Created",
  description: "Emit new event when a new session is created. [See the documentation](https://docs.browserbase.com/reference/api/list-sessions)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    browserbase,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    async listSessions() {
      return this.browserbase.listSessions();
    },
    getLastSessionTimestamp() {
      return this.db.get("lastSessionTimestamp") || 0;
    },
    setLastSessionTimestamp(ts) {
      this.db.set("lastSessionTimestamp", ts);
    },
  },
  hooks: {
    async deploy() {
      const sessions = await this.listSessions();
      sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      sessions.slice(0, 50).forEach((session) => {
        this.$emit(session, {
          id: session.id,
          summary: `New session: ${session.id}`,
          ts: Date.parse(session.createdAt),
        });
      });
      if (sessions.length) {
        this.setLastSessionTimestamp(Date.parse(sessions[0].createdAt));
      }
    },
  },
  async run() {
    const lastSessionTimestamp = this.getLastSessionTimestamp();
    const sessions = await this.listSessions();
    sessions.forEach((session) => {
      const sessionCreatedAt = Date.parse(session.createdAt);
      if (sessionCreatedAt > lastSessionTimestamp) {
        this.$emit(session, {
          id: session.id,
          summary: `New session: ${session.id}`,
          ts: sessionCreatedAt,
        });
      }
    });
    if (sessions.length) {
      this.setLastSessionTimestamp(Math.max(...sessions.map((s) => Date.parse(s.createdAt))));
    }
  },
};
