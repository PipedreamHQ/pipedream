import katto from "../../katto.app.mjs";

export default {
  key: "katto-get-job",
  name: "Get Job",
  description:
    "Retrieve a clip job and its current status. [See the documentation](https://katto.tech/docs/api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.katto.getJob({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Retrieved job \`${this.jobId}\` (status: ${response.status ?? "unknown"})`);
    return response;
  },
};
