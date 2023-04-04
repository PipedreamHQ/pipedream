import app from "../../crimeometer.app.mjs";

export default {
  key: "crimeometer-retrieve-raw-data",
  name: "Retrieve Raw Data",
  description: "Provides incidents raw data. [See the docs](https://www.crimeometer.com/crime-data-api-documentation) and [here](https://documenter.getpostman.com/view/12755833/TzK2auPn#0486d39c-a839-4fa6-a26b-104821b1813f).",
  type: "action",
  version: "0.0.1",
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
    page: {
      propDefinition: [
        app,
        "page",
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
      page,
    } = this;

    const response = await this.getRawData({
      step,
      params: {
        lat,
        lon,
        datetime_ini: datetimeIni,
        datetime_end: datetimeEnd,
        distance,
        page,
      },
    });

    step.export("$summary", `Successfully retrieved ${response.incidents?.length} incident(s).`);

    return response;
  },
};
