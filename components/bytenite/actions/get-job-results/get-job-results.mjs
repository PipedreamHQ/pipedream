import bytenite from "../../bytenite.app.mjs";

export default {
  key: "bytenite-get-job-results",
  name: "Get Job Results",
  description: "Secures the link of the output from a finished encoding job. The job's ID must be provided. An optional prop might be the desired format of the video file.",
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
    outputFormat: {
      propDefinition: [
        bytenite,
        "outputFormat",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bytenite.secureOutputLink();
    $.export("$summary", `Successfully fetched results for job ${this.jobId}`);
    return response;
  },
};
