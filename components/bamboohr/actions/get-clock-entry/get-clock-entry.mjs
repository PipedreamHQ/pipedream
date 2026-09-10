import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-clock-entry",
  name: "Get Clock Entry",
  description: "Get a single clock entry by ID (GET /time-tracking/clock-entries/{id}). While the entry is open, `end` and `clockOutLocation` are null. Use **List Clock Entries** to find IDs. [See the documentation](https://documentation.bamboohr.com/reference/get-clock-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    clockEntryId: {
      propDefinition: [
        bamboohr,
        "clockEntryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.getClockEntry({
      $,
      clockEntryId: this.clockEntryId,
    });
    $.export("$summary", `Retrieved clock entry ${this.clockEntryId}`);
    return response;
  },
};
