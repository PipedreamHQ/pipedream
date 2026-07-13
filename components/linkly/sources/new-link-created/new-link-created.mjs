import linkly from "../../linkly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  type: "source",
  key: "linkly-new-link-created",
  name: "New Link Created",
  description: "Emit new event when a new link is created in the workspace. Polls `GET /api/v1/workspace/{workspace_id}/list_links` sorted by `inserted_at` and emits anything newer than the last seen link ID. Useful for syncing newly-created short links to a CRM, spreadsheet, or analytics destination. [See the documentation](https://app.linklyhq.com/swaggerui#/Links/listLinks).",
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
    _getLastSeenId() {
      return this.db.get("lastSeenId");
    },
    _setLastSeenId(id) {
      this.db.set("lastSeenId", id);
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
    const lastSeenId = this._getLastSeenId();
    const firstRun = lastSeenId == null;
    let highestId = lastSeenId ?? 0;
    const newLinks = [];

    // Walk pages sorted by inserted_at desc. Stop as soon as we hit a link
    // we've already seen (id <= lastSeenId) — link IDs are monotonically
    // increasing, so everything past that point is older history.
    const iterator = this.linkly.paginate({
      resourceFn: this.linkly.listLinks,
      resourceType: "links",
      params: {
        sort_by: "inserted_at",
        sort_dir: "desc",
      },
    });

    for await (const link of iterator) {
      if (!firstRun && link.id <= lastSeenId) break;
      if (link.id > highestId) highestId = link.id;
      newLinks.push(link);
      // On first run, only record the high-water mark from the first page —
      // don't drain the whole workspace history.
      if (firstRun && newLinks.length >= 1) break;
    }

    // Emit oldest-first so downstream workflows process events in chronological
    // order. Skip emission entirely on first run — just set the watermark.
    if (!firstRun) {
      for (const link of newLinks.reverse()) {
        this.$emit(link, this.generateMeta(link));
      }
    }

    if (highestId > (lastSeenId ?? 0)) {
      this._setLastSeenId(highestId);
    } else if (firstRun) {
      // No links in the workspace yet — set watermark to 0 so subsequent
      // polls correctly identify any future link as new.
      this._setLastSeenId(0);
    }
  },
};
