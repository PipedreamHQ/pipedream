import scrapegraphai from "../../scrapegraphai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapegraphai-start-scraping-job",
  name: "Start Scraping Job",
  description: "Starts a new web scraping job. [See the documentation](${{docsLink}})",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapegraphai: {
      type: "app",
      app: "scrapegraphai",
    },
    url: {
      propDefinition: [
        "scrapegraphai",
        "url",
      ],
    },
    dataFields: {
      propDefinition: [
        "scrapegraphai",
        "dataFields",
      ],
      optional: true,
    },
    paginationSettings: {
      propDefinition: [
        "scrapegraphai",
        "paginationSettings",
      ],
      optional: true,
    },
    headers: {
      propDefinition: [
        "scrapegraphai",
        "headers",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.scrapegraphai.startScrapingJob({
      url: this.url,
      dataFields: this.dataFields,
      paginationSettings: this.paginationSettings,
      headers: this.headers,
    });
    $.export("$summary", `Started scraping job with Job ID: ${response.job_id}`);
    return response;
  },
};
