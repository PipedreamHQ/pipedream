import drift from "../../drift.app.mjs";

export default {
  key: "drift-new-lead",
  name: "New Lead",
  description: "Emit new event when a contact adds their email in chat.  [See the documentation](https://devdocs.drift.com/docs/webhook-events-1).",
  version: "0.0.1",
  type: "source",
  props: {
    drift,
    http: "$.interface.http",
  },
  async run(event) {

    const { body } = event;

    if (body?.type !== "contact_identified") {
      console.log("Ignored non-contact_identified event:", body?.type);
      return;
    }

    this.$emit(body, {
      summary: `New lead. Contact ID "${body.id}" proveded their email`,
      id: body.id,
      ts: body.createdAt,
    });
  },
};
