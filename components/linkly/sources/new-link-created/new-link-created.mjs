import linkly from "../../linkly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  type: "source",
  key: "linkly-new-link-created",
  name: "New Link Created",
  description: "Emit a new event when a new link is created in the workspace via the [Linkly URL Shortener API](https://linklyhq.com). Useful for syncing newly-created short links to a CRM, spreadsheet, or analytics destination.",
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
    _getSeenIds() {
      return this.db.get("seenIds") ?? [];
    },
    _setSeenIds(ids) {
      this.db.set("seenIds", ids);
    },
    generateMeta(link) {
      const ts = link.inserted_at
        ? new Date(link.inserted_at).getTime()
        : Date.now();
      return {
        id: `${link.id}`,
        summary: `New link ${link.id}: ${link.url}`,
        ts,
      };
    },
  },
  async run() {
    const seenIds = this._getSeenIds();
    const firstRun = seenIds.length === 0;
    const seen = new Set(seenIds);
    const allIds = [];
    const iterator = this.linkly.paginate({
      resourceFn: this.linkly.listLinks,
      resourceType: "links",
    });
    for await (const link of iterator) {
      allIds.push(link.id);
      if (seen.has(link.id)) continue;
      if (!firstRun) {
        this.$emit(link, this.generateMeta(link));
      }
    }
    // Cap the seen list to the most recent 5000 IDs to bound DB usage
    this._setSeenIds(allIds.slice(0, 5000));
  },
};
