import common from "../common.mjs";
import utils from "../../utils.mjs";
import constants from "../../constants.mjs";

const { zohoCreator } = common.props;
const { toSingleLineString } = utils;

export default {
  ...common,
  key: "zoho_creator-new-or-updated-record",
  description: toSingleLineString(`
    Emit new or updated records in a report. The \`Added Time\` and \`Modified Time\` fields must be added as
    **Grouping** fields in the Zoho Creator *record properties* for the **Report** chosen in
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
        The link name of the target report. The \`Added Time\` and \`Modified Time\` fields must be added as
        **Grouping** fields in the Zoho Creator *record properties* for the chosen report. See [the
        grouping help
        article](https://www.zoho.com/creator/newhelp/reports/display-records-as-groups-list-report.html).
      `),
    },
  },
  methods: {
    ...common.methods,
    getMetadata(record) {
      const id = JSON.stringify(record);
      return {
        id,
        summary: id,
        ts: Date.parse(record[constants.MODIFIED_TIME_FIELD] ?? record[constants.ADDED_TIME_FIELD]),
      };
    },
    processEvent(record) {
      this.$emit(record, this.getMetadata(record));
      this.setLastAddedTime(record[constants.ADDED_TIME_FIELD]);
      this.setLastModifiedTime(record[constants.MODIFIED_TIME_FIELD]);
    },
  },
  async run() {
    const {
      appLinkName,
      reportLinkName,
    } = this;

    // If last timestamp is not set, use timestamp of 1 day ago
    // to avoid fetching all records on first run of the source
    const aDayAgo = await this.zohoCreator.daysAgoString({
      appLinkName,
      days: 1,
    });

    const lastAddedTime = this.getLastAddedTime() ?? aDayAgo;
    const lastModifiedTime = this.getLastModifiedTime() ?? aDayAgo;

    const recordsStream =
      await this.zohoCreator.getRecordsStream({
        appLinkName,
        reportLinkName,
        addedTime: lastAddedTime,
        modifiedTime: lastModifiedTime,
      });

    for await (const record of recordsStream) {
      this.processEvent(record);
    }
  },
};
