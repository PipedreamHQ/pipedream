import zohoSign from "../../zoho_sign.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    zohoSign,
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
    emitEvent(doc) {
      const meta = this.generateMeta(doc);
      this.$emit(doc, meta);
    },
    isRelevant() {
      return true;
    },
    sortColumn() {
      throw new Error("sortColumn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const sortColumn = this.sortColumn();
    const lastTs = this._getLastTs();
    let maxLastTs = lastTs;
    const firstRun = lastTs === 0;
    const rowCount = firstRun
      ? 25
      : 100;
    let total = 0;
    let done = false;

    const params = {
      data: {
        page_context: {
          row_count: rowCount,
          start_index: 1,
          sort_column: sortColumn,
          sort_order: "DESC",
        },
      },
    };

    do {
      const { requests } = await this.zohoSign.listDocuments({
        params,
      });
      if (!requests) {
        break;
      }
      for (const request of requests) {
        if (request[sortColumn] > lastTs && this.isRelevant(request)) {
          this.emitEvent(request);
          if (request[sortColumn] > maxLastTs) {
            maxLastTs = request[sortColumn];
          }
        } else {
          done = true;
        }
      }
      total = requests?.length;
      params.data.page_context.start_index += rowCount;
    } while (total === rowCount && !done && !firstRun);

    this._setLastTs(maxLastTs);
  },
};
