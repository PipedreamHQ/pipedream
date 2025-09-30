import common from "../common/reports-query.mjs";
import utils from "../../common/utils.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "youtube_analytics_api-query-custom-analytics",
  name: "Query Custom Analytics",
  description:
    "Execute a custom analytics query using specified metrics, dimensions, filters, and date ranges. Requires query parameters to configure. [See the documentation](https://developers.google.com/youtube/analytics/reference/reports/query).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    metrics: propsFragments.metrics,
    filters: propsFragments.filters,
  },
  additionalProps() {
    return this.getIdsProps();
  },
  async run({ $ }) {
    const {
      app,
      getIdsParam,
      getFiltersParam,
      startDate,
      endDate,
      metrics,
      dimensions,
      sort,
      maxResults,
    } = this;

    const response = await app.reportsQuery({
      $,
      params: {
        ids: getIdsParam(),
        startDate,
        endDate,
        metrics: utils.arrayToCommaSeparatedList(metrics),
        dimensions: utils.arrayToCommaSeparatedList(dimensions),
        filters: getFiltersParam(),
        sort: utils.arrayToCommaSeparatedList(sort),
        maxResults,
      },
    });

    $.export("$summary", "Successfully fetched custom analytics data.");
    return response;
  },
};
