import katto from "../../katto.app.mjs";

export default {
  key: "katto-get-transcript",
  name: "Get Transcript",
  description:
    "Get the timestamped transcript of a job. [See the documentation](https://katto.tech/docs/api)",
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
    const response = await this.katto.getTranscript({
      $,
      jobId: this.jobId,
    });
    $.export("$summary", `Retrieved transcript for job \`${this.jobId}\``);
    return response;
  },
};
