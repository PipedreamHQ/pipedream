import googleSheets from "../../google_sheets.app.mjs";
import common from "../common/new-worksheet.mjs";
import base from "../common/http-based/base.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "google_sheets-new-worksheet-polling",
  name: "New Worksheet (Polling)",
  description: "Emit new event each time a new worksheet is created in a spreadsheet.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...common.hooks,
  },
  props: {
    googleSheets,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    watchedDrive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
    },
    sheetID: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.watchedDrive),
        }),
      ],
    },
  },
  methods: {
    ...base.methods,
    ...common.methods,
  },
  async run() {
    await this.processSpreadsheet({
      spreadsheetId: this.sheetID,
    });
  },
  sampleEmit,
};
