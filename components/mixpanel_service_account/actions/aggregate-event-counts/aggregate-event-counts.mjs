// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
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
      propDefinition: [
        app,
        "analysisType",
      ],
    },
    unit: {
      propDefinition: [
        app,
        "unit",
      ],
      description: "The size of each bucket in the returned series. Note that hourly unique counts are not supported by Mixpanel.",
      options: constants.TIME_UNITS,
      default: "day",
      optional: false,
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
    // Mixpanel answers this unsupported combination with a 200 and a full
    // hourly series, so unchecked it yields a confident but meaningless answer.
    if (this.analysisType === constants.UNIQUE_ANALYSIS_TYPE && this.unit === constants.HOUR_UNIT) {
      throw new ConfigurationError("Mixpanel does not support hourly unique counts. Use a Unit of `day` or larger with the `unique` Analysis Type, or keep `hour` and switch Analysis Type to `general`.");
    }

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

    // Summing per-bucket `unique` counts double-counts anyone active in more
    // than one bucket, and summing `average` values is meaningless.
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
