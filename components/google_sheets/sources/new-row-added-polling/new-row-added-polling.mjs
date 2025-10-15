import googleSheets from "../../google_sheets.app.mjs";
import common from "../common/new-row-added.mjs";
import base from "../common/http-based/base.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  key: "google_sheets-new-row-added-polling",
  name: "New Row Added",
  description: "Emit new event each time a row or rows are added to the bottom of a spreadsheet.",
  version: "0.1.2",
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
  async run() {
    const spreadsheet = await this.googleSheets.getSpreadsheet(this.sheetID);
    return this.processSpreadsheet(spreadsheet);
  },
};
