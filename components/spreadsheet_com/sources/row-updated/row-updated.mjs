import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import moment from "moment";
import spreadsheetCom from "../../spreadsheet_com.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "spreadsheet_com-row-updated",
  name: "New Row Updated",
  version: "0.0.1",
  description: "Emit new event when a row is updated.",
  type: "source",
  dedupe: "unique",
  props: {
    spreadsheetCom,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Spreadsheet.com on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workbookId: {
      propDefinition: [
        spreadsheetCom,
        "workbookId",
      ],
    },
    worksheetId: {
      propDefinition: [
        spreadsheetCom,
        "worksheetId",
        ({ workbookId }) => ({
          workbookId,
        }),
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    _getSortColumn() {
      return this.db.get("sortColumn");
    },
    _setSortColumn(sortColumn) {
      this.db.set("sortColumn", sortColumn);
    },
    async startEvent(maxResults = 0) {
      const {
        spreadsheetCom,
        worksheetId,
      } = this;

      const lastDate = this._getLastDate();
      const items = spreadsheetCom.paginate({
        fn: spreadsheetCom.listRows,
        maxResults,
        worksheetId,
        params: {
          sort: {
            "options": [
              {
                "column": this._getSortColumn(),
                "sortType": "desc",
              },
            ],
          },
        },
      });

      let responseArray = [];

      for await (const item of items) {
        if (moment(item.updatedAt).isSameOrBefore(lastDate)) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastDate(responseArray[0].updatedAt);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item._id + item.updatedAt,
            summary: `The row with id: "${item._id}" was updated!`,
            ts: item.updatedAt,
          },
        );
      }
    },
    async getUpdatedAtColumn() {
      const { spreadsheetCom } = this;
      const columns = spreadsheetCom.paginate({
        fn: spreadsheetCom.listColumns,
        worksheetId: this.worksheetId,
      });

      let sortColumn;
      for await (const column of columns) {
        if (column.dataType === "UPDATED_AT") {
          sortColumn = column.field;
          this._setSortColumn(column.field);
          break;
        }
      }
      if (!sortColumn) throw new ConfigurationError("This worksheet doesn't have a column of type UPDATED_AT.");
    },
  },
  hooks: {
    async deploy() {
      await this.getUpdatedAtColumn();
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
