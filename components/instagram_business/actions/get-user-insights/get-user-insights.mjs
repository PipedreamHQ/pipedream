import common from "../common/common.mjs";

export default {
  ...common,
  key: "instagram_business-get-user-insights",
  name: "Get User Insights",
  description: "Get insights data on a user. [See the documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights#reading)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    metrics: {
      propDefinition: [
        common.props.instagram,
        "userMetrics",
      ],
    },
    period: {
      propDefinition: [
        common.props.instagram,
        "period",
        (c) => ({
          metrics: c.metrics,
        }),
      ],
    },
    since: {
      type: "string",
      label: "Since",
      description: "Used in conjunction with {until} to define a Range. If you omit since and until, the API defaults to a 2 day range: yesterday through today. Enter in **ISO 8601** format *(e.g. 2016-03-12T12:00Z)*",
      optional: true,
    },
    until: {
      type: "string",
      label: "Until",
      description: "Used in conjunction with {since} to define a Range. If you omit since and until, the API defaults to a 2 day range: yesterday through today. Enter in **ISO 8601** format *(e.g. 2016-03-12T12:00Z)*",
      optional: true,
    },
  },
  async run({ $ }) {
    const accountId = await this.instagram.getInstagramBusinessAccountId({
      pageId: this.page,
      $,
    });

    const params = {
      metric: this.metrics.join(","),
      period: this.period,
    };
    if (this.since) {
      params.since = Date.parse(this.since) / 1000;
    }
    if (this.until) {
      params.until = Date.parse(this.until) / 1000;
    }

    const { data: insights } = await this.instagram.getUserInsights({
      accountId,
      params,
      $,
    });

    $.export("$summary", `Successfully retrieved insights on user with ID ${accountId}.`);

    return insights;
  },
};
