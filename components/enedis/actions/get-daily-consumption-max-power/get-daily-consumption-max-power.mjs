import enedis from "../../enedis.app.mjs";

export default {
  type: "action",
  key: "enedis-get-daily-consumption-max-power",
  version: "0.0.1",
  name: "Get daily consumption max power",
  description: "Returns the daily maximal power consumed in VA.",
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
    usage_point_id: {
      propDefinition: [
        enedis,
        "usage_point_id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enedis.dailyConsumptionMaxPower(
	  this.enedis.prepareAllParams(this)
	);
	$.export("$summary", `${response.meter_reading.interval_reading.length} value${response.meter_reading.interval_reading.length != 1 ? "s" : ""} has been retrieved.`);
    return response.meter_reading;
  },
};
