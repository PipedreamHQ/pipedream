import shortApp from "../../short.app.mjs";
import lodash from "lodash";

export default {
  key: "short-domain-statistics",
  name: "Domain Statistics.",
  description: "Returns detailed statistics for domain in given period. [See the docs](https://developers.short.io/reference/getdomaindomainid).",
  version: "0.0.1",
  type: "action",
  props: {
    shortApp,
    domainId: {
      propDefinition: [
        shortApp,
        "domainId",
      ],
    },
    period: {
      propDefinition: [
        shortApp,
        "period",
      ],
    },
    clicksChartInterval: {
      propDefinition: [
        shortApp,
        "clicksChartInterval",
      ],
    },
    tzOffset: {
      propDefinition: [
        shortApp,
        "tzOffset",
      ],
    },
    startDate: {
      propDefinition: [
        shortApp,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        shortApp,
        "endDate",
      ],
    },
  },
  async run({ $ }) {
    const param = lodash.pick(this, [
      "period",
      "clicksChartInterval",
      "tzOffset",
      "startDate",
      "endDate",
    ]);
    const statistics = await this.shortApp.getDomainStatistics($, this.domainId, param);
    $.export("$summary", `Successfully fetched domain statistics for: ${this.domainId}`);
    return statistics;
  },
};
