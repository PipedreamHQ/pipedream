import cheddar from "../../cheddar.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";
import { XMLParser } from "fast-xml-parser";

export default {
  props: {
    cheddar,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    productCode: {
      propDefinition: [
        cheddar,
        "productCode",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    _parseXml(xml, resource) {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        isArray: (name) => name === resource,
      });
      return parser.parse(xml);
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const fn = this.getResourceFn();
      const resource = this.getResourceType();

      const xml = await fn({
        productCode: this.productCode,
      });
      const data = this._parseXml(xml, resource);
      const items = data[`${resource}s`][resource];

      let results = [];
      for (const item of items) {
        const ts = Date.parse(item.createdDatetime);
        if (ts > lastTs) {
          results.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }

      if (!results.length) {
        return;
      }

      if (max && results.length > max) {
        results = results.slice(-1 * max);
      }

      results.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });

      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceType() {
      throw new ConfigurationError("getResourceType is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
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
