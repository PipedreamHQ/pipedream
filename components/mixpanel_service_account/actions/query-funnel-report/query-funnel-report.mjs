// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../mixpanel_service_account.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mixpanel_service_account-query-funnel-report",
  name: "Query Funnel Report",
  description: "Get conversion numbers for a funnel that has already been saved in the Mixpanel UI: step counts, conversion rates, and average time between steps. [See the documentation](https://docs.mixpanel.com/reference/funnels-query)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    funnelId: {
      type: "integer",
      label: "Funnel ID",
      description: "The numeric ID of the saved funnel to query, for example `7509`. Use **List Saved Funnels** to find it.",
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
    conversionWindowLength: {
      type: "integer",
      label: "Conversion Window Length",
      description: `How long a user has to finish the funnel after triggering its first step, counted in Conversion Window Unit. May not exceed ${constants.MAX_FUNNEL_LENGTH_DAYS} days. Defaults to whatever was saved with the funnel in the Mixpanel UI.`,
      min: 1,
      optional: true,
    },
    conversionWindowUnit: {
      type: "string",
      label: "Conversion Window Unit",
      description: "The unit that Conversion Window Length is counted in: `second`, `minute`, `hour`, or `day`. For example, `day` with a Conversion Window Length of 7 gives users a week to convert. Defaults to whatever was saved with the funnel in the Mixpanel UI.",
      options: constants.FUNNEL_LENGTH_UNITS,
      optional: true,
    },
    unit: {
      propDefinition: [
        app,
        "unit",
      ],
      description: "The size of each bucket in the returned series: `day`, `week`, or `month`. This is an alternate way of expressing Interval - set one or the other, not both.",
    },
    interval: {
      propDefinition: [
        app,
        "interval",
      ],
    },
    on: {
      propDefinition: [
        app,
        "on",
      ],
    },
    where: {
      propDefinition: [
        app,
        "where",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: `The maximum number of segment values to return. Defaults to ${constants.DEFAULT_TOP_VALUES_LIMIT}. Has no effect unless Segment On is set.`,
      max: constants.MAX_FUNNEL_SEGMENTATION_LIMIT,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    if (this.unit && this.interval) {
      throw new ConfigurationError("Unit and Interval are alternate ways of expressing the same thing - set one or the other, not both. Use Unit for `week` or `month` buckets, or Interval for a bucket of N days.");
    }

    // Only checkable when both halves are set; otherwise Mixpanel falls back to
    // the unit saved with the funnel, which we cannot see here.
    if (this.conversionWindowLength && this.conversionWindowUnit) {
      const windowInDays = this.conversionWindowLength
        * constants.DAYS_PER_FUNNEL_LENGTH_UNIT[this.conversionWindowUnit];
      if (windowInDays > constants.MAX_FUNNEL_LENGTH_DAYS) {
        throw new ConfigurationError(`Conversion Window Length of ${this.conversionWindowLength} ${this.conversionWindowUnit}(s) exceeds Mixpanel's maximum of ${constants.MAX_FUNNEL_LENGTH_DAYS} days. Lower Conversion Window Length or use a smaller Conversion Window Unit.`);
      }
    }

    const response = await this.app.queryFunnelReport({
      $,
      params: {
        funnel_id: this.funnelId,
        from_date: this.fromDate,
        to_date: this.toDate,
        length: this.conversionWindowLength,
        length_unit: this.conversionWindowUnit,
        unit: this.unit,
        interval: this.interval,
        on: this.on,
        where: this.where,
        limit: this.limit,
        workspace_id: this.workspaceId,
      },
    });

    $.export("$summary", `Retrieved funnel ${this.funnelId} from ${this.fromDate} to ${this.toDate}`);

    return response;
  },
};
