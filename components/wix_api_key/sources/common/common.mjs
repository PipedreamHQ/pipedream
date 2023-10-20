import wix from "../../wix_api_key.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    wix,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    site: {
      propDefinition: [
        wix,
        "site",
      ],
    },
  },
  hooks: {
    async deploy() {
      const params = this.getParams();
      const resources = await this.getResources({
        siteId: this.site,
        params,
      });
      if (!(resources.length > 0)) {
        return;
      }
      this._setLastTs(this.getTs(resources[0]));
      resources.slice(0, 25).reverse()
        .forEach((resource) => this.emitEvent(resource));
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getTs(resource) {
      return Date.parse(resource.createdDate);
    },
    getParams() {
      throw new ConfigurationError("getParams is not implemented");
    },
    advancePage() {
      throw new ConfigurationError("advancePage is not implemented");
    },
    getResources() {
      throw new ConfigurationError("getResources is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let params = this.getParams();
    let total, done, maxTs = null;
    const limit = constants.DEFAULT_LIMIT;

    do {
      const resources = await this.getResources({
        siteId: this.site,
        params,
      });
      if (!(resources.length > 0)) {
        break;
      }
      if (!maxTs) {
        maxTs = this.getTs(resources[0]);
      }
      total = resources.length;
      for (const resource of resources) {
        if (this.getTs(resource) > lastTs) {
          this.emitEvent(resource);
        } else {
          done = true;
        }
      }
      params = this.advancePage(params);
    } while (total === limit && !done);

    this._setLastTs(maxTs);
  },
};
