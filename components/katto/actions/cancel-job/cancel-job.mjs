import katto from "../../katto.app.mjs";

export default {
  key: "katto-cancel-job",
  name: "Cancel Job",
  description:
    "Cancel a running job and refund its video slot. [See the documentation](https://katto.tech/docs/api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    katto,
    jobId: {
      propDefinition: [
        katto,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.katto.cancelJob({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Cancelled job \`${this.jobId}\``);
    return response;
  },
};
