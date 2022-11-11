import rebrandly from "../../rebrandly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Link",
  version: "0.0.2",
  key: "rebrandly-new-link",
  description: "Emit new event on each new link created.",
  type: "source",
  dedupe: "unique",
  props: {
    rebrandly,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this._setLastLinkId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New link with id ${data.id}`,
        ts: Date.parse(data.createdAt),
      });
    },
    _setLastLinkId(id) {
      this.db.set("lastLinkId", id);
    },
    _getLastLinkId() {
      return this.db.get("lastLinkId");
    },
  },
  hooks: {
    async deploy() {
      const links = await this.rebrandly.getLinks({
        params: {
          limit: 10,
          orderBy: "createdAt",
          orderDir: "asc",
        },
      });

      links.forEach(this.emitEvent);
    },
  },
  async run() {
    const lastLinkId = this._getLastLinkId();

    while (true) {
      const links = await this.rebrandly.getLinks({
        params: {
          last: lastLinkId,
          orderBy: "createdAt",
          orderDir: "asc",
        },
      });

      links.forEach(this.emitEvent);

      if (links.length < 25) {
        return;
      }
    }
  },
};
