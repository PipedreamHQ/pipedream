import linkly from "../../linkly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  type: "source",
  key: "linkly-new-link-clicked",
  name: "New Link Clicked",
  description: "Emit new event when a Linkly link is clicked",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    linkly,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getClicks() {
      return this.db.get("clicks") ?? {};
    },
    _setClicks(clicks) {
      this.db.set("clicks", clicks);
    },
    generateMeta(link, difference) {
      const ts = Date.now();
      return {
        id: `${link.id}${ts}`,
        summary: `Link ${link.id} Clicked ${difference} time${difference === 1
          ? ""
          : "s"}`,
        ts,
      };
    },
  },
  async run() {
    const oldClicks = this._getClicks();
    const items = this.linkly.paginate({
      resourceFn: this.linkly.listLinks,
      resourceType: "links",
    });

    for await (const item of items) {
      if (!oldClicks[item.id] || item.clicks_total > oldClicks[item.id]) {
        const difference = !oldClicks[item.id]
          ? item.clicks_total
          : item.clicks_total - oldClicks[item.id];
        if (difference > 0) {
          const meta = this.generateMeta(item, difference);
          this.$emit(item, meta);
        }
        oldClicks[item.id] = item.clicks_total;
      }
    }

    this._setClicks(oldClicks);
  },
};
