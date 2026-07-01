import app from "../../loopquest.app.mjs";

export default {
  key: "loopquest-create-review-task",
  name: "Create Review Task",
  description: "Send AI/automation output to a human. Gate a downstream action until it's approved, or monitor quality in the background. [See the documentation](https://loopquest.tomphillips.uk/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    loopquest: app,
    content: { propDefinition: [app, "content"] },
    title: { propDefinition: [app, "title"] },
    module: { propDefinition: [app, "module"] },
    mode: { propDefinition: [app, "mode"] },
    claim: { propDefinition: [app, "claim"] },
    sourceText: { propDefinition: [app, "sourceText"] },
    timeoutSeconds: { propDefinition: [app, "timeoutSeconds"] },
    onTimeout: { propDefinition: [app, "onTimeout"] },
    source: { propDefinition: [app, "source"] },
    externalId: { propDefinition: [app, "externalId"] },
    callbackUrl: { propDefinition: [app, "callbackUrl"] },
    reviewsRequired: { propDefinition: [app, "reviewsRequired"] },
  },
  async run({ $ }) {
    const res = await this.loopquest.createTask({
      $,
      props: {
        content: this.content,
        title: this.title,
        module: this.module,
        mode: this.mode,
        claim: this.claim,
        sourceText: this.sourceText,
        timeoutSeconds: this.timeoutSeconds,
        onTimeout: this.onTimeout,
        source: this.source,
        externalId: this.externalId,
        callbackUrl: this.callbackUrl,
        reviewsRequired: this.reviewsRequired,
      },
    });
    $.export("$summary", `Submitted review task ${res.id}`);
    return res;
  },
};
