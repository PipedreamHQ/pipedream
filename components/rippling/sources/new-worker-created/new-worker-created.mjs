import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import rippling from "../../rippling.app.mjs";

export default {
  key: "rippling-new-worker-created",
  name: "New Worker Created",
  description: "Emit new event when a new worker is created in Rippling. [See the documentation](https://developer.rippling.com/documentation/rest-api/reference/list-workers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rippling,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    filter: {
      propDefinition: [
        rippling,
        "filterWorkers",
      ],
    },
    expand: {
      propDefinition: [
        rippling,
        "expandWorkers",
      ],
    },
  },
  methods: {
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt") || 0;
    },
    _setLastCreatedAt(createdAt) {
      this.db.set("lastCreatedAt", createdAt);
    },
    generateMeta(worker) {
      return {
        id: worker.id,
        summary: `New Worker: ${worker?.user?.display_name || worker.id}`,
        ts: Date.parse(worker.created_at),
      };
    },
    async processEvents(max) {
      const lastCreatedAt = this._getLastCreatedAt();
      let maxCreatedAt = lastCreatedAt;
      const workers = await this.rippling.paginate({
        fn: this.rippling.listWorkers,
        args: {
          params: {
            order_by: "created_at desc",
            ...(this.filter && {
              filter: this.filter,
            }),
            ...(this.expand && {
              expand: this.expand.join(","),
            }),
          },
        },
        max,
      });
      for await (const worker of workers) {
        const ts = Date.parse(worker.created_at);
        if (ts > lastCreatedAt) {
          this.$emit(worker, this.generateMeta(worker));
          if (ts > maxCreatedAt) {
            maxCreatedAt = ts;
          }
        } else {
          break;
        }
      }
      this._setLastCreatedAt(maxCreatedAt);
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  async run() {
    await this.processEvents();
  },
};
