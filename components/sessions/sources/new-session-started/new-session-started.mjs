import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sessions from "../../sessions.app.mjs";

export default {
  key: "sessions-new-session-started",
  name: "New Session Started",
  description: "Emit new an event when a session starts. [See the documentation](https://api.app.sessions.us/api-docs/#/default/get_api_sessions)",
  version: "0.0.1",
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
    emitEvent(data) {
      this._setLastResourceId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New session started with id ${data.id}`,
        ts: Date.parse(data.startAt),
      });
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 0;

    while (page >= 0) {
      const resources = await this.sessions.getSessions({
        params: {
          page,
          per_page: 100,
        },
      });

      resources.filter((resource) => !resource.endedAt).reverse()
        .forEach(this.emitEvent);

      if (resources.filter((payment) => payment.id === lastResourceId)) {
        return;
      }

      page++;
    }
  },
};
