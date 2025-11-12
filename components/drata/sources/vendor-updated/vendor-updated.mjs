import drata from "../../drata.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/VendorsPublicController_listVendorss/";

export default {
  key: "drata-vendor-updated",
  name: "Vendor Updated",
  description: `Emit a new event when a vendor is updated. [See the documentation](${docsLink}).`,
  type: "source",
  version: "0.0.4",
  props: {
    drata,
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
      const response = await this.drata.listVendors({
        paginate: true,
        // this endpoint does not support custom sorting by creation date
      });

      const visitedIds = {};
      for (const vendor of response.data) {
        visitedIds[vendor.id] = new Date(vendor.updatedAt).getTime();
      }
      this._setVisitedIds(visitedIds);

      const historical = this.sortByUpdatedDate(response.data)
        .slice(-constants.DEPLOY_LIMIT)
        .reverse();

      for (const vendor of historical) {
        this.$emit(vendor, {
          id: vendor.id,
          summary: `Historical vendor added event: ${vendor.name}`,
          ts: vendor.updatedAt,
        });
      }
    },
  },
  methods: {
    _getVisitedIds() {
      return this.db.get("visitedIds");
    },
    _setVisitedIds(visitedIds) {
      this.db.set("visitedIds", visitedIds);
    },
    sortByUpdatedDate(list) {
      return list.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    },
  },
  async run() {
    const visitedIds = this._getVisitedIds();

    const response = await this.drata.listVendors({
      paginate: true,
    });

    for (const vendor of this.sortByUpdatedDate(response.data)) {
      const ts = new Date(vendor.updatedAt).getTime();
      if (!visitedIds[vendor.id] || visitedIds[vendor.id] !== ts) {
        visitedIds[vendor.id] = ts;
        this.$emit(vendor, {
          id: vendor.id,
          summary: `Vendor updated: ${vendor.name}`,
          ts,
        });
      }
    }

    this._setVisitedIds(visitedIds);
  },
};
