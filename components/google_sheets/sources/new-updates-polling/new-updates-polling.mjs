import googleSheets from "../../google_sheets.app.mjs";
import common from "../common/new-updates.mjs";
import base from "../common/http-based/base.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  key: "google_sheets-new-updates-polling",
  name: "New Updates",
  description: "Emit new event each time a row or cell is updated in a spreadsheet.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
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
      description: "Defaults to My Drive. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
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
    ...common.props,
  },
  methods: {
    ...base.methods,
    ...common.methods,
  },
  hooks: {
    async deploy() {
      await this.takeSheetSnapshot();
    },
  },
  async run() {
    const spreadsheet = await this.googleSheets.getSpreadsheet(this.sheetID);
    return this.processSpreadsheet(spreadsheet);
  },
};
