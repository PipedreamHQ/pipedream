import katto from "../../katto.app.mjs";

export default {
  key: "katto-get-clips",
  name: "Get Clips",
  description:
    "Get the finished clips of a completed job. [See the documentation](https://katto.tech/docs/api)",
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
    const response = await this.katto.getClips({
      $,
      jobId: this.jobId,
    });
    const count = Array.isArray(response)
      ? response.length
      : (response.clips?.length ?? response.data?.length ?? 0);
    $.export("$summary", `Retrieved ${count} clip(s) for job \`${this.jobId}\``);
    return response;
  },
};
