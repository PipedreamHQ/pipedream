import constants from "../../common/constants.mjs";
import app from "../../crimeometer.app.mjs";

export default {
  key: "crimeometer-retrieve-stats",
  name: "Retrieve Stats",
  description: "Provides incidents statistics. [See the docs](https://www.crimeometer.com/crime-data-api-documentation) and [here](https://documenter.getpostman.com/view/12755833/TzK2auPn#f00742da-8325-4234-bb26-32b4ade34bd3).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    lat: {
      propDefinition: [
        app,
        "lat",
      ],
    },
    lon: {
      propDefinition: [
        app,
        "lon",
      ],
    },
    datetimeIni: {
      propDefinition: [
        app,
        "datetimeIni",
      ],
    },
    datetimeEnd: {
      propDefinition: [
        app,
        "datetimeEnd",
      ],
    },
    distance: {
      propDefinition: [
        app,
        "distance",
      ],
    },
  },
  methods: {
    getStats(args = {}) {
      return this.app.makeRequest({
        versionPath: constants.VERSION_PATH.V2,
        path: "/incidents/stats",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      lat,
      lon,
      datetimeIni,
      datetimeEnd,
      distance,
    } = this;

    const response = await this.getStats({
      step,
      params: {
        lat,
        lon,
        datetime_ini: datetimeIni,
        datetime_end: datetimeEnd,
        distance,
      },
    });

    step.export("$summary", `Successfully retrieved stats for ${response.incidents_count} incidents.`);

    return response;
  },
};
