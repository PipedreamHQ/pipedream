import hana from "../../hana.app.mjs";

export default {
  key: "hana-search-report-group-messages",
  name: "Search Report Group Messages",
  description: "Search for report group messages. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#get-report-group-messages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hana,
    reportGroupId: {
      propDefinition: [
        hana,
        "reportGroupId",
      ],
    },
    search: {
      propDefinition: [
        hana,
        "search",
      ],
    },
    perPage: {
      propDefinition: [
        hana,
        "perPage",
      ],
    },
    page: {
      propDefinition: [
        hana,
        "page",
      ],
    },
    startTimestamp: {
      type: "string",
      label: "Start Timestamp",
      description: "The start timestamp from which the messages must be fetched (inclusive). Example - `2025-02-16T01:42:07.213Z`",
      optional: true,
    },
    endTimestamp: {
      type: "string",
      label: "End Timestamp",
      description: "The end timestamp up to which the messages must be fetched (inclusive). Example - `2025-02-16T01:42:07.213Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hana.searchReportGroupMessages({
      $,
      reportGroupId: this.reportGroupId,
      params: {
        search: this.search,
        per_page: this.perPage,
        page: this.page,
        start_timestamp: this.startTimestamp,
        end_timestamp: this.endTimestamp,
      },
    });
    if (response?.content?.data?.length) {
      $.export("$summary", `Successfully retrieved ${response?.content?.data?.length} report group message${response?.content?.data?.length === 1
        ? ""
        : "s"}.`);
    }
    return response;
  },
};
