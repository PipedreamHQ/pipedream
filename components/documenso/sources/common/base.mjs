import documenso from "../../documenso.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    documenso,
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
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const tsField = this.getTsField();

    const docs = [];
    let total;
    const params = {
      page: 1,
    };
    do {
      const { documents } = await this.documenso.listDocuments({
        params,
      });
      for (const doc of documents) {
        const ts = Date.parse(doc[tsField]);
        if (ts >= lastTs) {
          if (await this.isRelevant(doc, lastTs)) {
            docs.push(doc);
          }
          maxTs = Math.max(ts, maxTs);
        }
      }
      total = documents?.length;
      params.page++;
    } while (total > 0);

    for (const doc of docs) {
      const meta = await this.generateMeta(doc);
      this.$emit(doc, meta);
    }

    this._setLastTs(maxTs);
  },
};
