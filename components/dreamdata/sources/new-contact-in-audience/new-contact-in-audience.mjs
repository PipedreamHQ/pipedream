import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "dreamdata-new-contact-in-audience",
  name: "New Contact in Audience (Instant)",
  description: "Emit new event when a contact enters a Dreamdata audience. Set up the webhook in Dreamdata's **Activation Hub > Syncs > Webhooks**, choose the contact audience and `Insert` or `Upsert` operation, and paste the URL below into the **Webhook URL** field. [See the documentation](https://docs.dreamdata.io/article/mdebkprrgi-webhook-syncs).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      label: "Source Configuration",
      description: "Instructions for configuring the Dreamdata webhook sync.",
      alertType: "info",
      content: "After deploying, copy this source's HTTP endpoint into Dreamdata's webhook sync configuration. Configure the sync with a **contact audience**.",
    },
  },
  methods: {
    ...common.methods,
    _summarize(body) {
      const audienceName = this._getAudienceName(body);
      const props = body?.data?.properties ?? {};
      const fullName = [
        props.first_name,
        props.last_name,
      ].filter(Boolean).join(" ");
      const contactLabel = fullName
        || props.name
        || body?.data?.email
        || body?.data?.dd_contact_id
        || "contact";
      return {
        id: this._getEventId(body),
        summary: `${contactLabel} entered ${audienceName}`,
        ts: this._getEventTs(body),
      };
    },
  },
};
