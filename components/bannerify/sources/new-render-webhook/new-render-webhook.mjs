import sampleEmit from "./test-event.mjs";

export default {
  key: "bannerify-new-render-webhook",
  name: "New Render Webhook",
  description: "Emit new event when Bannerify or another service sends a render callback to the generated webhook URL.",
  version: "0.0.1",
  type: "source",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  sampleEmit,
  async run(event) {
    const body = event.body ?? {};
    const id = body.id ?? event.headers?.["x-request-id"] ?? Date.now();
    const summary = body.url
      ? `Bannerify render ${body.url}`
      : "Bannerify render event";

    this.$emit(body, {
      id,
      summary,
      ts: Date.now(),
    });

    await this.http.respond({
      status: 200,
      body: {
        ok: true,
      },
    });
  },
};
