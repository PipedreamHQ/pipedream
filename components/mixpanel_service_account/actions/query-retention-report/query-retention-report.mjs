// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../mixpanel_service_account.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mixpanel_service_account-query-retention-report",
  name: "Query Retention Report",
  description: "Run a cohort retention analysis: of the users who first did one event, how many came back and did another over the following intervals. Answers questions like \"what does week-4 retention look like for users who signed up in June?\". The response maps each cohort date to a `first` count and a `counts` array, one entry per interval. [See the documentation](https://docs.mixpanel.com/reference/retention-query)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
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
    retentionType: {
      type: "string",
      label: "Retention Type",
      description: "Which kind of retention to measure. One of `birth` (first-time retention, measured from each user's first Born Event) or `compounded` (recurring retention, measured from every qualifying event). Defaults to `birth`.",
      options: constants.RETENTION_TYPES,
      default: constants.BIRTH_RETENTION_TYPE,
    },
    bornEvent: {
      type: "string",
      label: "Born Event",
      description: "The event that puts a user into a cohort, exactly as tracked (for example, `Signed Up`). Required when Retention Type is `birth`; ignored when it is `compounded`.",
      optional: true,
    },
    event: {
      type: "string",
      label: "Returning Event",
      description: "The event that counts as coming back, exactly as tracked (for example, `Viewed Report`). Leave empty to count any event.",
      optional: true,
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "The unit each retention interval is measured in: `day`, `week`, or `month`. For example, `week` with an Interval Count of 4 gives you week-1 through week-4 retention. Mixpanel defaults to `day` when this is left empty. This is an alternate way of expressing Interval - set one or the other, not both.",
      options: constants.RETENTION_TIME_UNITS,
      optional: true,
    },
    interval: {
      type: "integer",
      label: "Interval",
      description: `How many days make up a single retention interval, for example \`7\`. Defaults to 1, and may not exceed ${constants.MAX_RETENTION_DAY_INTERVAL}. This is an alternate way of expressing Unit - set one or the other, not both.`,
      min: 1,
      optional: true,
    },
    intervalCount: {
      type: "integer",
      label: "Interval Count",
      description: "How many intervals to return per cohort. Defaults to 1. Note that a \"0th\" interval is included for users who returned less than one interval after the Born Event.",
      min: 1,
      optional: true,
    },
    unboundedRetention: {
      type: "boolean",
      label: "Unbounded Retention",
      description: "When `true`, interval N counts users who returned on interval N or on any interval after it, accumulating right to left. Defaults to `false`. [Learn more about counting methods](https://help.mixpanel.com/hc/en-us/articles/360045484191)",
      optional: true,
    },
    bornWhere: {
      type: "string",
      label: "Born Where",
      description: "A segmentation expression that filters which Born Events qualify a user for a cohort. Example: `properties[\"plan\"] == \"pro\"`. [See the expression syntax](https://docs.mixpanel.com/reference/segmentation-expressions)",
      optional: true,
    },
    where: {
      propDefinition: [
        app,
        "where",
      ],
      description: "A segmentation expression that filters which Returning Events count. Example: `properties[\"$browser\"] == \"Chrome\"`. [See the expression syntax](https://docs.mixpanel.com/reference/segmentation-expressions)",
    },
    on: {
      propDefinition: [
        app,
        "on",
      ],
      description: "A segmentation expression to break the returning users down by. Example: `properties[\"$city\"]`. [See the expression syntax](https://docs.mixpanel.com/reference/segmentation-expressions)",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of segment values to return. Has no effect unless Segment On is set.",
      min: 1,
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    if (this.retentionType === constants.BIRTH_RETENTION_TYPE && !this.bornEvent) {
      throw new ConfigurationError("Born Event is required when Retention Type is `birth`. Use **List Events** to find the exact event name, or set Retention Type to `compounded`.");
    }

    // Mixpanel answers both of these with an opaque HTTP 500 rather than a
    // validation message, so they are caught here where the error can say what
    // to change. Sending `unit` and `interval` together is rejected server-side
    // the same way it is on the funnels endpoint - they are alternates.
    if (this.unit && this.interval) {
      throw new ConfigurationError("Unit and Interval are alternate ways of expressing the same thing - set one or the other, not both. Use Unit for `week` or `month` buckets, or Interval for a bucket of N days.");
    }

    if (this.interval > constants.MAX_RETENTION_DAY_INTERVAL) {
      throw new ConfigurationError(`Interval may not exceed ${constants.MAX_RETENTION_DAY_INTERVAL} days. Set Unit to \`week\` or \`month\` instead to cover a longer span.`);
    }

    const response = await this.app.queryRetentionReport({
      $,
      params: {
        from_date: this.fromDate,
        to_date: this.toDate,
        retention_type: this.retentionType,
        born_event: this.bornEvent,
        event: this.event,
        unit: this.unit,
        interval: this.interval,
        interval_count: this.intervalCount,
        unbounded_retention: this.unboundedRetention,
        born_where: this.bornWhere,
        where: this.where,
        on: this.on,
        limit: this.limit,
        workspace_id: this.workspaceId,
      },
    });

    const cohorts = Object.keys(response).length;
    $.export("$summary", `Retrieved ${this.retentionType} retention for ${cohorts} cohort${cohorts === 1
      ? ""
      : "s"} from ${this.fromDate} to ${this.toDate}`);

    return response;
  },
};
