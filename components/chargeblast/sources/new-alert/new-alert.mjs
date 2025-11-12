import app from "../../chargeblast.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "chargeblast-new-alert",
  name: "New Alert in Chargeblast",
  description: "Emit new event for each alert in Chargeblast. [See the documentation](https://docs.chargeblast.io/reference/getembedalerts)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
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
        summary: `New alert with ID ${data.id}`,
        ts: Date.parse(data.createdAt),
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

    let page = 1;

    while (page >= 0) {
      const resources = await this.app.getAlerts({
        params: {
          page,
        },
      });

      resources.reverse().forEach(this.emitEvent);

      if (resources.filter((resource) => resource.id === lastResourceId)) {
        page = -1;
        return;
      }

      page++;
    }
  },
};
