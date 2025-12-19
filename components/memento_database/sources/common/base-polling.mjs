import mementoDatabase from "../../memento_database.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    mementoDatabase,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    libraryId: {
      propDefinition: [
        mementoDatabase,
        "libraryId",
      ],
    },
  },
  methods: {
    _getLastRevision() {
      return this.db.get("lastRevision") || 1;
    },
    _setLastRevision(lastRevision) {
      this.db.set("lastRevision", lastRevision);
    },
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getArgs() {
      return {
        libraryId: this.libraryId,
        params: {
          fields: "all",
        },
      };
    },
    isRelevant() {
      return true;
    },
    getTsField() {
      throw new ConfigurationError("getTsField must be implemented");
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      let args = this.getArgs();
      const tsField = this.getTsField();

      args = {
        ...args,
        params: {
          ...args?.params,
          pageSize: 100,
          startRevision: this._getLastRevision(),
        },
      };
      let hasMore = true;
      let nextRevision = args.params.startRevision;
      const items = [];

      do {
        const {
          entries, nextPageToken, revision,
        } = await resourceFn(args);
        for (const entry of entries) {
          const ts = Date.parse(entry[tsField]);
          if (ts > lastTs) {
            maxTs = Math.max(ts, maxTs);
            if (this.isRelevant(entry)) {
              items.push(entry);
            }
          }
        }
        nextRevision = revision;
        if (!entries?.length) {
          break;
        }
        hasMore = entries.length === args.params.pageSize;
        args.params.pageToken = nextPageToken;
      } while (hasMore);

      this._setLastRevision(nextRevision);
      this._setLastTs(maxTs);

      if (max && items.length > max) {
        items.length = max;
      }

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
