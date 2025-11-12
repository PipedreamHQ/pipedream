import app from "../../crimeometer.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "crimeometer-retrieve-raw-data",
  name: "Retrieve Raw Data",
  description: "Provides incidents raw data. [See the docs](https://www.crimeometer.com/crime-data-api-documentation) and [here](https://documenter.getpostman.com/view/12755833/TzK2auPn#0486d39c-a839-4fa6-a26b-104821b1813f).",
  type: "action",
  version: "0.0.3",
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
    max: {
      propDefinition: [
        app,
        "max",
      ],
    },
  },
  methods: {
    getRawData(args = {}) {
      return this.app.makeRequest({
        path: "/incidents/raw-data",
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
      max,
    } = this;

    const incidents = await utils.streamIterator(
      this.app.getResourcesStream({
        max,
        resourceFn: this.getRawData,
        resourceFnArgs: {
          step,
          params: {
            lat,
            lon,
            datetime_ini: datetimeIni,
            datetime_end: datetimeEnd,
            distance,
          },
        },
      }),
    );

    step.export("$summary", `Successfully retrieved ${incidents.length} incident(s).`);

    return incidents;
  },
};
