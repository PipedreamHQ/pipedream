import app from "../../loopquest.app.mjs";

export default {
  key: "loopquest-new-verdict",
  name: "New Verdict",
  description: "Emit an event the moment a human reviewer resolves a task — approve, flag, escalate or timeout. Use it to resume a gated action or act on a monitored review. [See the documentation](https://loopquest.tomphillips.uk/docs).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    loopquest: app,
    http: { type: "$.interface.http", customResponse: true },
    db: "$.service.db",
  },
  hooks: {
    // Register this source's HTTP endpoint as a verdict subscription. LoopQuest
    // then POSTs every resolved verdict here (idempotent by URL server-side).
    async activate() {
      const { id } = await this.loopquest.subscribeVerdicts({ $: this, url: this.http.endpoint });
      this.db.set("hookId", id);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      if (hookId) await this.loopquest.unsubscribeVerdicts({ $: this, id: hookId });
    },
  },
  async run(event) {
    // Ack immediately so LoopQuest marks the delivery successful.
    this.http.respond({ status: 200 });

    const body = event.body;
    if (!body || !body.task_id) return;

    const verdict =
      body.verdict === true ? "approved"
        : body.verdict === false ? "flagged"
          : body.escalated ? "escalated"
            : "resolved";

    this.$emit(body, {
      // Unique per delivery: a task's state (approved/flagged/escalated) makes
      // the id stable for the same resolution but distinct if state ever differs.
      id: `${body.task_id}:${verdict}`,
      summary: `Verdict: ${verdict}${body.external_id ? ` (${body.external_id})` : ""}`,
      ts: Date.now(),
    });
  },
};
