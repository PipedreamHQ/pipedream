import livesession from "../../livesession.app.mjs";

export default {
  key: "livesession-new-session-event-instant",
  name: "New Session Event Instant",
  description: "Emits a new event when a new session event is created in LiveSession",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    livesession: {
      type: "app",
      app: "livesession",
    },
    sessionId: {
      propDefinition: [
        livesession,
        "sessionId",
      ],
    },
    userData: {
      propDefinition: [
        livesession,
        "userData",
      ],
      optional: true,
    },
    sessionDuration: {
      propDefinition: [
        livesession,
        "sessionDuration",
      ],
      optional: true,
    },
    sessionSource: {
      propDefinition: [
        livesession,
        "sessionSource",
      ],
      optional: true,
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const opts = {
        sessionId: this.sessionId,
        userData: this.userData,
        sessionDuration: this.sessionDuration,
        sessionSource: this.sessionSource,
      };
      const sessionEvent = await this.livesession.createSessionEvent(opts);
      this.db.set("sessionEventId", sessionEvent.id);
    },
    async deactivate() {
      this.db.set("sessionEventId", null);
    },
  },
  async run(event) {
    const sessionEvent = event.body;
    const sessionEventId = this.db.get("sessionEventId");

    if (sessionEvent.id !== sessionEventId) {
      this.$emit(sessionEvent, {
        id: sessionEvent.id,
        summary: `New session event: ${sessionEvent.id}`,
        ts: Date.now(),
      });
      this.db.set("sessionEventId", sessionEvent.id);
    }
  },
};
