import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-production-load-curve",
  version: "0.0.2",
  name: "Get Production Load Curve",
  description: "Returns the daily average power produced in W, on a given interval (by default 30 minutes). [See the docs here](https://datahub-enedis.fr/data-connect/documentation/metering-v5-production-30-minutes/)",
  ...common,
  props: {
    enedis,
    start: {
      propDefinition: [
        enedis,
        "start",
      ],
    },
    end: {
      propDefinition: [
        enedis,
        "end",
      ],
    },
    usagePointId: {
      propDefinition: [
        enedis,
        "usagePointId",
      ],
    },
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const response = await this.enedis.getProductionLoadCurve(
      this.prepareAllParams(),
    );
    $.export("$summary", `${response.meter_reading.interval_reading.length} value${response.meter_reading.interval_reading.length != 1
      ? "s"
      : ""} has been retrieved.`);
    return response.meter_reading;
  },
};
