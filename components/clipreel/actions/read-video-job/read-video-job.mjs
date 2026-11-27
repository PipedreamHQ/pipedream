import clipreel from "../../clipreel.app.mjs";

export default {
  key: "clipreel-read-video-job",
  name: "Read Video Job",
  description: "Get the status and result of a ClipReel edit or render job. [Documentation](https://www.clipreel.com/agents/automate-video-editing-with-ai-agents)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  props: {
    clipreel,
    jobId: { propDefinition: [clipreel, "jobId"] },
  },
  async run({ $ }) {
    const result = await this.clipreel.readVideoJob({ $, jobId: this.jobId });
    $.export("$summary", "Read the ClipReel job.");
    return result;
  },
};
