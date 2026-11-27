import flatverify from "../../flatverify.app.mjs";

export default {
  key: "flatverify-get-job",
  name: "Get Job",
  description: "Get the progress and counts of a verification job: `status` (`queued`, `running`, `waiting` or `done`), `total`, `processed` and `counts` per status."
    + " Use after **Verify List** until `status` is `done`, then call **Get Job Results** for the rows."
    + " [See the documentation](https://flatverify.com/docs#bulk)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    flatverify,
    jobId: {
      propDefinition: [
        flatverify,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flatverify.getJob({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Job ${response.id} is ${response.status}: ${response.processed} of ${response.total} checked`);
    return response;
  },
};
