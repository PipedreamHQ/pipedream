import scrapegraphai from "../../scrapegraphai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapegraphai-stop-running-job",
  name: "Stop Running Job",
  description: "Stops a currently running web scraping job. [See the documentation](https://docs.scrapegraphai.com/)",
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
  },
  async run({ $ }) {
    const response = await this.scrapegraphai.stopScrapingJob({
      jobId: this.jobId,
    });
    $.export("$summary", `Stopped scraping job ${this.jobId}`);
    return response;
  },
};
