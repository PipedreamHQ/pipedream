import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../supabird.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling interval",
      description: "How often Pipedream checks SupaBird for new items.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    socialSet: {
      propDefinition: [
        app,
        "socialSet",
      ],
      description: "Only emit items of this social set, e.g. `6af6f28f3d61850002518bfe`. Use **List Social Sets** to find it (the `id` field). Leave empty to watch every social set.",
    },
  },
  hooks: {
    async deploy() {
      // Emit a bounded set of the most recent items so users have data to build with.
      await this.processEvents({
        isDeploy: true,
      });
    },
  },
  methods: {
    _getSeenIds() {
      return this.db.get("seenIds");
    },
    _setSeenIds(ids) {
      this.db.set("seenIds", ids);
    },
    /**
     * @returns {Function} The app method that lists this source's items.
     */
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    /**
     * @returns {object} Extra query parameters for the list call.
     */
    getResourceParams() {
      return {};
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    /**
     * @param {object} item - The item returned by the API.
     * @returns {number} Event timestamp in milliseconds.
     */
    getTimestamp(item) {
      return utils.toTimestamp(item.created_at);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: this.getTimestamp(item),
      };
    },
    /**
     * Lists are newest first and have no "since" filter, so this scans from the
     * top, remembers the IDs it has seen, and stops after a run of already-seen
     * items. On the first run it only looks at the first page and emits at most
     * the 25 most recent items.
     */
    async processEvents({ isDeploy = false } = {}) {
      const seenIds = this._getSeenIds();
      const isFirstRun = !seenIds;
      const seen = new Set(seenIds ?? []);
      const maxItems = isFirstRun
        ? constants.PAGE_LIMIT
        : constants.PAGE_LIMIT * constants.MAX_PAGES_PER_POLL;

      const scanned = [];
      const fresh = [];
      let consecutiveSeen = 0;

      const items = this.app.paginate({
        fn: this.getResourceFn(),
        args: {
          params: {
            ...this.getResourceParams(),
            social_set: this.socialSet,
          },
        },
        max: maxItems,
      });

      for await (const item of items) {
        scanned.push(item.id);
        if (seen.has(item.id)) {
          if (++consecutiveSeen >= constants.STOP_AFTER_SEEN) {
            break;
          }
          continue;
        }
        consecutiveSeen = 0;
        fresh.push(item);
      }

      const toEmit = (isFirstRun
        ? fresh.slice(0, constants.MAX_EMIT_ON_FIRST_RUN)
        : fresh).reverse();

      for (const item of toEmit) {
        this.$emit(item, this.generateMeta(item));
      }

      // Persist state after emitting, newest first, capped.
      const merged = [
        ...scanned,
        ...(seenIds ?? []).filter((id) => !scanned.includes(id)),
      ].slice(0, constants.MAX_SEEN_IDS);
      this._setSeenIds(merged);

      return {
        isDeploy,
        emitted: toEmit.length,
      };
    },
  },
  async run() {
    await this.processEvents();
  },
};
