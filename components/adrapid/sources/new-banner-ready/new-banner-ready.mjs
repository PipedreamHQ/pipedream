import adrapid from "../../adrapid.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adrapid-new-banner-ready",
  name: "New Banner Ready",
  description: "Emit new event when a new banner is ready. [See the documentation](https://docs.adrapid.com/api/overview)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    adrapid,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.adrapid.emitNewBannerEvent();
    },
    async activate() {
      // No webhook to create
    },
    async deactivate() {
      // No webhook to delete
    },
  },
  methods: {
    _getLastCheckedTime() {
      return this.db.get("lastCheckedTime") || 0;
    },
    _setLastCheckedTime(time) {
      this.db.set("lastCheckedTime", time);
    },
  },
  async run() {
    const lastCheckedTime = this._getLastCheckedTime();
    const banners = await this.adrapid._makeRequest({
      path: "/banners",
    });

    for (const banner of banners) {
      if (banner.status === "ready" && new Date(banner.updatedAt).getTime() > lastCheckedTime) {
        this.$emit(banner, {
          summary: `New banner ready: ${banner.id}`,
          id: banner.id,
          ts: new Date(banner.updatedAt).getTime(),
        });
      }
    }

    this._setLastCheckedTime(Date.now());
  },
};
