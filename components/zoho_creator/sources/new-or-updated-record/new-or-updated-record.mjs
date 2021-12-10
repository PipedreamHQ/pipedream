import zohoCreator from "../../zoho_creator.app.mjs";
import utils from "../../utils.mjs";
import constants from "../../constants.mjs";

const { toSingleLineString } = utils;

export default {
  key: "zoho_creator-new-record",
  description: toSingleLineString(`
    Emit new or updated records in a report. The \`Modified Time\` field must be added as a
    **Grouping** field in the Zoho Creator *record properties* for the **Report** chosen in
    the dropdown below. See [the grouping help
    article](https://www.zoho.com/creator/newhelp/reports/display-records-as-groups-list-report.html)
    and [the docs](https://www.zoho.com/creator/help/api/v2/get-records.html) for more
    information.
  `),
  type: "source",
  name: "New or Updated Record",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    zohoCreator,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling interval",
      description: "How often to poll the Zoho Creator API for new or updated records",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    appLinkName: {
      propDefinition: [
        zohoCreator,
        "appLinkName",
      ],
    },
    reportLinkName: {
      propDefinition: [
        zohoCreator,
        "reportLinkName",
        ({ appLinkName }) => ({
          appLinkName,
        }),
      ],
      description: toSingleLineString(`
        The link name of the target report. The \`Modified Time\` field must be added as a
        **Grouping** field in the Zoho Creator *record properties* for the chosen report. See [the
        grouping help
        article](https://www.zoho.com/creator/newhelp/reports/display-records-as-groups-list-report.html).
      `),
    },
  },
  methods: {
    getLastTimestamp() {
      return this.db.get(constants.LAST_TIMESTAMP);
    },
    setLastTimestamp(timestamp) {
      return this.db.set(constants.LAST_TIMESTAMP, timestamp);
    },
    getMetadata(record) {
      return {
        id: record.ID,
        summary: JSON.stringify(record),
        ts: Date.parse(record[constants.MODIFIED_TIME_FIELD]),
      };
    },
    processEvent(record) {
      this.$emit(record, this.getMetadata(record));
      this.setLastTimestamp(record[constants.MODIFIED_TIME_FIELD]);
    },
  },
  async run() {
    const {
      appLinkName,
      reportLinkName,
    } = this;

    // If last timestamp is not set, use timestamp of 1 day ago
    // to avoid fetching all records on first run of the source
    const lastTimestamp =
      this.getLastTimestamp()
      ?? await this.zohoCreator.daysAgoString({
        appLinkName,
        days: 1,
      });

    const recordsStream =
      await this.zohoCreator.getRecordsStream({
        appLinkName,
        reportLinkName,
        afterModifiedTime: lastTimestamp,
      });

    for await (const record of recordsStream) {
      this.processEvent(record);
    }
  },
};
