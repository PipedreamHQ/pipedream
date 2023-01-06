import enedis from "../../enedis.app.mjs";

export default {
  type: "action",
  key: "enedis-get-daily-consumption",
  version: "0.0.1",
  name: "Get daily consumption",
  description: "Returns the daily consumption in Wh.",
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
    const response = await this.enedis.dailyConsumption(
	  this.enedis.prepareAllParams(this)
	);
	$.export("$summary", `${response.meter_reading.interval_reading.length} value${response.meter_reading.interval_reading.length != 1 ? "s" : ""} has been retrieved.`);
    return response.meter_reading;
  },
};
