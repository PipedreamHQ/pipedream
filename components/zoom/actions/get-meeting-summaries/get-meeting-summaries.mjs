import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-summaries",
  name: "Get Meeting Summaries",
  description: "Retrieve a list of all meeting or webinar summaries available for an account. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/Listmeetingsummaries)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoom,
    from: {
      type: "string",
      label: "From Date",
      description: "Start date for meeting summaries in `yyyy-MM-dd` format. The date range defined by the `from` and `to` parameters should be a month as the response only includes meetings from a month. Example: `2024-01-01`",
    },
    to: {
      type: "string",
      label: "To Date",
      description: "End date for meeting summaries in `yyyy-MM-dd` format. The date range defined by the `from` and `to` parameters should be a month as the response only includes meetings from a month. Example: `2024-01-31`",
    },
    max: {
      propDefinition: [
        zoom,
        "max",
      ],
      description: "The maximum number of meeting summaries to retrieve. Default is 300.",
    },
  },
  async run({ $ }) {
    const {
      zoom,
      from,
      to,
      max,
    } = this;

    const summaries = [];

    const results = zoom.getResourcesStream({
      resourceFn: zoom.getMeetingSummaries,
      resourceFnArgs: {
        $,
        params: {
          from,
          to,
        },
      },
      resourceName: "summaries",
      max,
    });

    for await (const summary of results) {
      summaries.push(summary);
    }

    $.export("$summary", `Successfully retrieved ${summaries.length} meeting ${summaries.length === 1
      ? "summary"
      : "summaries"} from ${from} to ${to}`);

    return summaries;
  },
};
