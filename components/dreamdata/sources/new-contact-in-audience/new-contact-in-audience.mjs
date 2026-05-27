import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "dreamdata-new-contact-in-audience",
  name: "New Contact in Audience (Instant)",
  description: "Emit an event when a contact enters a Dreamdata audience. Set up the webhook in Dreamdata's **Activation Hub → Syncs → Webhooks**, choose the contact audience and `Insert` or `Upsert` operation, and paste the URL below into the **Webhook URL** field. [See the documentation](https://docs.dreamdata.io/article/mdebkprrgi-webhook-syncs).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: "After deploying, copy this source's HTTP endpoint into Dreamdata's webhook sync configuration. Configure the sync with a **contact audience**.",
    },
  },
  methods: {
    ...common.methods,
    _summarize(body) {
      const audienceName = body?.audience?.name ?? "audience";
      const props = body?.data?.properties ?? {};
      const fullName = [
        props.first_name,
        props.last_name,
      ].filter(Boolean).join(" ");
      const contactLabel = fullName
        || body?.data?.email
        || body?.data?.dd_contact_id
        || "contact";
      const id = body?.message_id
        ?? `${body?.data?.dd_contact_id ?? contactLabel}-${body?.sent_at ?? Date.now()}`;
      const ts = body?.sent_at
        ? Date.parse(body.sent_at)
        : Date.now();
      return {
        id,
        summary: `${contactLabel} entered ${audienceName}`,
        ts,
      };
    },
  },
};
