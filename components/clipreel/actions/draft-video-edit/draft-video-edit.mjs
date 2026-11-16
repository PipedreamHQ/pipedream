import clipreel from "../../clipreel.app.mjs";

export default {
  key: "clipreel-draft-video-edit",
  name: "Draft a Video Edit",
  description: "Queue a reviewable edit for an existing ClipReel video project. This uses the connected account’s plan. [Documentation](https://www.clipreel.com/agents/automate-video-editing-with-ai-agents)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  props: {
    clipreel,
    projectId: { propDefinition: [clipreel, "projectId"] },
    prompt: { propDefinition: [clipreel, "prompt"] },
    idempotencyKey: { propDefinition: [clipreel, "idempotencyKey"] },
  },
  async run({ $ }) {
    const result = await this.clipreel.draftVideoEdit({
      $, projectId: this.projectId, prompt: this.prompt, idempotencyKey: this.idempotencyKey,
    });
    $.export("$summary", "Queued a ClipReel draft for review.");
    return result;
  },
};
