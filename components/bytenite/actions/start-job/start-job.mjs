import bytenite from "../../bytenite.app.mjs";

export default {
  key: "bytenite-start-job",
  name: "Start Job",
  description: "Initiates a previously created video encoding job. [See the documentation](https://docs.bytenite.com/reference/customer_runjob)",
  version: "0.0.1",
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
    const response = await this.bytenite.startJob({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Successfully initiated job with ID: ${this.jobId}`);
    return response;
  },
};
