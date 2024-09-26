import livesession from "../../livesession.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "livesession-new-session",
  name: "New Session",
  description: "Emit new event when a new session is created in LiveSession. [See the documentation](https://developers.livesession.io/rest-api/reference#list-sessions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    livesession,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter events by the email address that you have associated with a session",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    generateMeta(session) {
      return {
        id: session.id,
        summary: `New Session ID ${session.id}`,
        ts: session.creation_timestamp,
      };
    },
    async processEvent(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;
      const params = {
        date_from: new Date(lastCreated),
        email: this.email,
      };
      const items = this.livesession.paginate({
        resourceFn: this.livesession.listSessions,
        params,
        resourceType: "sessions",
        max,
      });
      for await (const item of items) {
        if (item.creation_timestamp > lastCreated) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          if (item.creation_timestamp > maxCreated) {
            maxCreated = item.creation_timestamp;
          }
        }
      }
      this._setLastCreated(maxCreated);
    },
  },
  async run() {
    await this.processEvent();
  },
};
