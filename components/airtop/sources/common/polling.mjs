import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import airtop from "../../airtop.app.mjs";

export default {
  props: {
    airtop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    isNew(resource, lastTs) {
      if (!resource.dateCreated || !lastTs) {
        return true;
      }
      return new Date(resource.dateCreated).getTime() > lastTs;
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    let lastTs = this._getLastTs();

    const resources = await this.getResources(lastTs);
    for (const resource of resources) {
      const { dateCreated } = resource;
      if (!lastTs || (dateCreated && new Date(dateCreated).getTime() > lastTs)) {
        lastTs = new Date(dateCreated).getTime();
      }
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    }

    if (lastTs) {
      this._setLastTs(lastTs);
    }
  },
};

