import orcaScan from "../../orca_scan.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "orca_scan-new-sheet",
  name: "New Sheet Created",
  description: "Emits an event when a new sheet is created in Orca Scan. [See the documentation](https://orcascan.com/guides/add-barcode-tracking-to-your-system-using-a-rest-api-f09a21c3)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    orcaScan,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getSheetId(sheet) {
      return sheet._id;
    },
    _getLastProcessedSheetId() {
      return this.db.get("lastProcessedSheetId") || null;
    },
    _setLastProcessedSheetId(sheetId) {
      this.db.set("lastProcessedSheetId", sheetId);
    },
  },
  hooks: {
    async deploy() {
      // get the most recent sheets
      const sheets = await this.orcaScan.getSheets();

      // we'll only process up to 50 most recent sheets to avoid emitting too many events at once
      const recentSheets = sheets.slice(0, 50);

      // store the most recent sheet's ID
      if (recentSheets.length > 0) {
        const lastProcessedSheetId = this._getSheetId(recentSheets[0]);
        this._setLastProcessedSheetId(lastProcessedSheetId);
      }

      // emit an event for each sheet
      for (const sheet of recentSheets) {
        this.$emit(sheet, {
          id: this._getSheetId(sheet),
          summary: `New Sheet: ${sheet.name}`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    // get the last processed sheet ID from the db
    const lastProcessedSheetId = this._getLastProcessedSheetId();

    // get the list of sheets
    const sheets = await this.orcaScan.getSheets();

    // find any new sheets since the last run
    const newSheets = sheets.filter((sheet) => {
      return this._getSheetId(sheet) !== lastProcessedSheetId;
    });

    // update the last processed sheet ID in the db
    if (newSheets.length > 0) {
      const lastProcessedSheetId = this._getSheetId(newSheets[0]);
      this._setLastProcessedSheetId(lastProcessedSheetId);
    }

    // emit an event for each new sheet
    for (const sheet of newSheets) {
      this.$emit(sheet, {
        id: this._getSheetId(sheet),
        summary: `New Sheet: ${sheet.name}`,
        ts: Date.now(),
      });
    }
  },
};
