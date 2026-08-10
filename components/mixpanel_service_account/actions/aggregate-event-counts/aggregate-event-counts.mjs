// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mixpanel_service_account-aggregate-event-counts",
  name: "Aggregate Event Counts",
  description: "Count how many times one or more events happened over a date range, bucketed by minute, hour, day, week, or month. This is the tool for ad-hoc questions such as \"how many signups this week?\" - it needs no report to be saved in Mixpanel first. If the answer should come from an Insights report someone already built, use **Query Insights Report** instead. [See the documentation](https://docs.mixpanel.com/reference/list-recent-events)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    eventNames: {
      type: "string[]",
      label: "Event Names",
      description: "One or more event names to count, exactly as they are tracked in Mixpanel (for example, `Signed Up`). Names are case-sensitive. Use **List Events** to discover them.",
    },
    analysisType: {
      type: "string",
      label: "Analysis Type",
      description: "How the events are counted. Use `unique` to answer \"how many users\" and `general` to answer \"how many times\".",
      options: constants.ANALYSIS_TYPES,
      default: "general",
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "The size of each bucket in the returned series. Note that hourly unique counts are not supported by Mixpanel.",
      options: constants.TIME_UNITS,
      default: "day",
    },
    fromDate: {
      propDefinition: [
        app,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        app,
        "toDate",
      ],
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.aggregateEventCounts({
      $,
      params: {
        event: JSON.stringify(this.eventNames),
        type: this.analysisType,
        unit: this.unit,
        from_date: this.fromDate,
        to_date: this.toDate,
        workspace_id: this.workspaceId,
      },
    });

    // Only `general` buckets can be summed into a meaningful total. Adding up
    // per-bucket `unique` counts double-counts anyone active in more than one
    // bucket, and adding up `average` values is meaningless - so for those the
    // caller has to read the returned series rather than a headline number.
    const total = this.analysisType === constants.GENERAL_ANALYSIS_TYPE
      ? Object
        .values(response.data?.values ?? {})
        .flatMap((buckets) => Object.values(buckets))
        .reduce((sum, count) => sum + count, 0)
      : null;

    $.export("$summary", `Retrieved ${this.analysisType} counts for ${this.eventNames.length} event${this.eventNames.length === 1
      ? ""
      : "s"} from ${this.fromDate} to ${this.toDate}${total != null
      ? ` (${total} total)`
      : ""}`);

    return response;
  },
};
