import chartmogul from "../../chartmogul.app.mjs";

export default {
  props: {
    chartmogul,
    startDate: {
      propDefinition: [
        chartmogul,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        chartmogul,
        "endDate",
      ],
    },
    geo: {
      propDefinition: [
        chartmogul,
        "geo",
      ],
      optional: true,
    },
    plans: {
      propDefinition: [
        chartmogul,
        "plans",
      ],
      optional: true,
    },
  },
  methods: {
    getAditionalParams() {
      return {};
    },
  },
  async run({ $ }) {
    const {
      startDate,
      endDate,
      interval,
      geo,
      plans,
    } = this;

    const response = await this.chartmogul.getMetrics({
      $,
      metric: this.getMetric(),
      params: {
        "start-date": startDate,
        "end-date": endDate,
        interval,
        geo,
        "plans": plans && encodeURI(plans),
      },
    });

    $.export("$summary", this.getSummary());
    return response;
  },
};
