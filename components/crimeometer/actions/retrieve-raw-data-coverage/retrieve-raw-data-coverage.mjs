import constants from "../../common/constants.mjs";
import app from "../../crimeometer.app.mjs";

export default {
  key: "crimeometer-retrieve-raw-data-coverage",
  name: "Retrieve Raw Data Coverage",
  description: "Provides raw data coverage information grouped by cities. [See the docs](https://www.crimeometer.com/crime-data-api-documentation) and [here](https://documenter.getpostman.com/view/12755833/TzK2auPn#ea645970-96d9-4fbd-8c29-d070f08b1f12).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  methods: {
    getRawDataCoverage(args = {}) {
      return this.app.makeRequest({
        versionPath: constants.VERSION_PATH.V3,
        path: "/crime-incidents/coverage",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getRawDataCoverage({
      step,
    });

    step.export("$summary", `Successfully retrieved coverage information of ${response.cities.length} cities.`);

    return response;
  },
};
