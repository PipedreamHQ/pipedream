import enedis from "../../enedis.app.mjs";
import common from "../common.mjs";

export default {
  type: "action",
  key: "enedis-get-daily-production",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Daily Production",
  description: "Returns the daily production in Wh. [See the docs here](https://datahub-enedis.fr/data-connect/documentation/metering-v5-production-quotidienne/)",
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
    const response = await this.enedis.getDailyProduction(
      this.prepareAllParams(),
    );
    $.export("$summary", `${response.meter_reading.interval_reading.length} value${response.meter_reading.interval_reading.length != 1
      ? "s"
      : ""} has been retrieved.`);
    return response.meter_reading;
  },
};
