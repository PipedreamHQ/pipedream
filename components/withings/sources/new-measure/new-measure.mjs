import withings from "../../withings.app.mjs";

export default {
  key: "withings-new-measure",
  name: "New Measure",
  description: "Emit new event for each created measure. [See docs here](https://developer.withings.com/api-reference#operation/measure-getmeas)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    withings,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run() {
    const measures = await this.withings.getMeasures({
      params: {
        lastupdate: Math.round((new Date().getTime() / 1000) - 86400), // 1 day
      },
    });

    for (const measure of measures) {
      this.$emit(measure, {
        id: measure.grpid,
        summary: `New measure ${measure.grpid}`,
        ts: Date.parse(measure.created),
      });
    }
  },
};
