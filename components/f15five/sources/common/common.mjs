import f15five from "../../f15five.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    f15five,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.getResources();
      if (!(resources?.length > 0)) {
        return;
      }
      this._setLastId(resources[0].id);
      resources.reverse().forEach((resource) => this.emitEvent(resource));
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    async paginate(lastId) {
      const params = this.getParams({
        page: 1,
      });
      let total = 0;
      let done = false;
      let maxId = null;

      do {
        const results = await this.getResources(params);
        if (!(results?.length > 0)) {
          break;
        }
        total = results.length;
        if (!maxId) {
          maxId = results[0].id;
        }
        for (const result of results) {
          if (result.id > lastId) {
            this.emitEvent(result);
          } else {
            done = true;
          }
        }
        params.page += 1;
      } while (total === 100 && !done);

      this._setLastId(maxId);
    },
  },
  async run() {
    const lastId = this._getLastId();
    await this.paginate(lastId);
  },
};
