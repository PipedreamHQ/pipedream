import summit from "../../summit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "summit-new-session",
  name: "New Session",
  description: "Emits an event when a new session is finished",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    summit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    sessionId: {
      propDefinition: [
        summit,
        "session_id",
      ],
    },
    sessionStart: {
      propDefinition: [
        summit,
        "session_start",
      ],
      optional: true,
    },
    sessionEnd: {
      propDefinition: [
        summit,
        "session_end",
      ],
      optional: true,
    },
  },
  methods: {
    _getSessionId() {
      return this.db.get("sessionId") ?? "";
    },
    _setSessionId(sessionId) {
      this.db.set("sessionId", sessionId);
    },
  },
  hooks: {
    async deploy() {
      const session = await this.summit.emitSessionEvent({
        session_id: this.sessionId,
        session_start: this.sessionStart,
        session_end: this.sessionEnd,
      });
      this._setSessionId(session.session_id);
      this.$emit(session, {
        id: session.session_id,
        summary: `New Session: ${session.session_id}`,
        ts: Date.parse(session.session_end),
      });
    },
  },
  async run() {
    const newSession = await this.summit.emitSessionEvent({
      session_id: this.sessionId,
      session_start: this.sessionStart,
      session_end: this.sessionEnd,
    });
    if (newSession.session_id !== this._getSessionId()) {
      this._setSessionId(newSession.session_id);
      this.$emit(newSession, {
        id: newSession.session_id,
        summary: `New Session: ${newSession.session_id}`,
        ts: Date.parse(newSession.session_end),
      });
    }
  },
};
