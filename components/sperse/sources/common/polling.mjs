import app from "../../sperse.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
  ConfigurationError,
} from "@pipedream/platform";

export default {
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
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      return;
    },
  },
  async run() {
    const {
      _getLastId,
      _setLastId,
      generateMeta,
      getResourceFn,
      getResourceFnArgs,
    } = this;

    let lastId = _getLastId();
    let maxId = lastId;

    const resourcesFn = getResourceFn();
    const { result } = await resourcesFn(getResourceFnArgs());

    const resources = result || [];

    for (const resource of resources.reverse()) {
      if (resource.id <= lastId) {
        continue;
      }

      this.$emit(resource, generateMeta(resource));
      if (resource.id > maxId) {
        maxId = resource.id;
      }
    }

    if (maxId > lastId) {
      _setLastId(maxId);
    }
  },
};
