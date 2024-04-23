import bytenite from "../../bytenite.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bytenite-start-job",
  name: "Start Job",
  description: "Initiates a previously created video encoding job. The ID of the job, obtained during the creation step, is a required prop.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bytenite,
    jobId: {
      propDefinition: [
        bytenite,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bytenite.initiateVideoEncodingJob({
      jobId: this.jobId,
    });
    $.export("$summary", `Successfully initiated job with ID: ${this.jobId}`);
    return response;
  },
};
