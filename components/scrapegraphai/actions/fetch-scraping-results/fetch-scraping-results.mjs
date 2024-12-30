import scrapegraphai from "../../scrapegraphai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapegraphai-fetch-scraping-results",
  name: "Fetch Scraping Results",
  description: "Retrieves the results of a completed scraping job. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapegraphai,
    jobId: {
      propDefinition: [
        scrapegraphai,
        "jobId",
      ],
    },
    filterDataFields: {
      propDefinition: [
        scrapegraphai,
        "filterDataFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const results = await this.scrapegraphai.retrieveScrapingResults({
      jobId: this.jobId,
      filterDataFields: this.filterDataFields,
    });
    $.export("$summary", `Successfully retrieved scraping results for job ${this.jobId}`);
    return results;
  },
};
