import drata from "../../drata.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/VendorsPublicController_listVendorss/";

export default {
  key: "drata-new-vendor-added",
  name: "New Vendor Added",
  description: `Emit a new event for every new vendor. [See the documentation](${docsLink}).`,
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
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

      this._setVisitedIds(response.data.map((vendor) => vendor.id));

      const historical = this.sortByCreation(response.data)
        .slice(-constants.DEPLOY_LIMIT)
        .reverse();

      for (const vendor of historical) {
        this.$emit(vendor, {
          id: vendor.id,
          summary: `Historical vendor added event: ${vendor.name}`,
          ts: vendor.createdAt,
        });
      }
    },
  },
  methods: {
    _getVisitedIds() {
      return new Set(this.db.get("visitedIds"));
    },
    _setVisitedIds(visitedIds) {
      this.db.set("visitedIds", Array.from(visitedIds));
    },
    sortByCreation(list) {
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
  },
  async run() {
    const visitedIds = this._getVisitedIds();

    const response = await this.drata.listVendors({
      paginate: true,
    });

    for (const vendor of this.sortByCreation(response.data)) {
      if (!visitedIds.has(vendor.id)) {
        visitedIds.add(vendor.id);
        this.$emit(vendor, {
          id: vendor.id,
          summary: `New vendor added: ${vendor.name}`,
          ts: vendor.createdAt,
        });
      }
    }

    this._setVisitedIds(visitedIds);
  },
};
