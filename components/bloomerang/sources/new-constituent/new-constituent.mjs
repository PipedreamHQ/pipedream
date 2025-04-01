import { axios } from "@pipedream/platform";
import bloomerang from "../../bloomerang.app.mjs";

export default {
  key: "bloomerang-new-constituent",
  name: "New Constituent Created",
  description: "Emit new event when a new constituent profile is created in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bloomerang,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // Every 15 minutes
      },
    },
    constituentType: {
      propDefinition: [
        bloomerang,
        "constituentType",
      ],
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || new Date(0).toISOString();
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    async _getConstituents(afterTimestamp) {
      const params = {
        dateCreatedOnOrAfter: afterTimestamp,
      };
      if (this.constituentType) {
        params.constituentType = this.constituentType;
      }

      return this.bloomerang._makeRequest({
        path: "/constituents",
        params,
      });
    },
  },
  hooks: {
    async deploy() {
      const constituents = await this._getConstituents(new Date().toISOString());
      constituents.slice(-50).reverse()
        .forEach(this.emitConstituent);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const constituents = await this._getConstituents(lastTimestamp);

    for (const constituent of constituents) {
      this.emitConstituent(constituent);
    }

    if (constituents.length > 0) {
      const newLastTimestamp = new Date(
        Math.max(...constituents.map((c) => new Date(c.dateCreatedOn))),
      ).toISOString();
      this._setLastTimestamp(newLastTimestamp);
    }
  },
  emitConstituent(constituent) {
    this.$emit(constituent, {
      id: constituent.id.toString(),
      summary: `New Constituent: ${constituent.name}`,
      ts: new Date(constituent.dateCreatedOn).getTime(),
    });
  },
};
