import common from "../common.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

const { zohoCreator } = common.props;
const { toSingleLineString } = utils;

export default {
  ...common,
  key: "zoho_creator-new-record",
  description: toSingleLineString(`
    Emit new records in a report. The \`Added Time\` field must be added as a **Grouping** field
    in the Zoho Creator *record properties* for the **Report** chosen in the dropdown below. See
    [the grouping help
    article](https://www.zoho.com/creator/newhelp/reports/display-records-as-groups-list-report.html)
    and [the docs](https://www.zoho.com/creator/help/api/v2/get-records.html) for more
    information.
  `),
  type: "source",
  name: "New Record",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    reportLinkName: {
      propDefinition: [
        zohoCreator,
        "reportLinkName",
        ({ appLinkName }) => ({
          appLinkName,
        }),
      ],
      description: toSingleLineString(`
        The link name of the target report. The \`Added Time\` field must be added as a
        **Grouping** field in the Zoho Creator *record properties* for the chosen report. See [the
        grouping help
        article](https://www.zoho.com/creator/newhelp/reports/display-records-as-groups-list-report.html).
      `),
    },
  },
  methods: {
    ...common.methods,
    getMetadata(record) {
      return {
        id: record.ID,
        summary: JSON.stringify(record),
        ts: Date.parse(record[constants.ADDED_TIME_FIELD]),
      };
    },
    validateRecord(record) {
      if (!record[constants.ADDED_TIME_FIELD]) {
        throw new Error("Record is missing the \"Added Time\" field. Add the \"Added Time\" Grouping field in the Zoho Creator record properties for the Report.");
      }
    },
    processEvent(record) {
      this.validateRecord(record);
      this.$emit(record, this.getMetadata(record));
      this.setLastTimestamp(record[constants.ADDED_TIME_FIELD]);
    },
  },
  async run() {
    const {
      appLinkName,
      reportLinkName,
    } = this;

    // If last timestamp is not set, use timestamp of 1 day ago
    // to avoid fetching all records on first run of the source
    const lastAddedTime =
      this.getLastTimestamp()
      ?? await this.zohoCreator.daysAgoString({
        appLinkName,
        days: 1,
      });

    const recordsStream =
      await this.zohoCreator.getRecordsStream({
        appLinkName,
        reportLinkName,
        addedTime: lastAddedTime,
      });

    for await (const record of recordsStream) {
      this.processEvent(record);
    }
  },
};
