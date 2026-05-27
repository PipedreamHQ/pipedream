import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "dreamdata-new-company-in-audience",
  name: "New Company in Audience (Instant)",
  description: "Emit an event when a company enters a Dreamdata audience. Set up the webhook in Dreamdata's **Activation Hub → Syncs → Webhooks**, choose the company audience and `Insert` or `Upsert` operation, and paste the URL below into the **Webhook URL** field. [See the documentation](https://docs.dreamdata.io/article/mdebkprrgi-webhook-syncs).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: "After deploying, copy this source's HTTP endpoint into Dreamdata's webhook sync configuration. Configure the sync with a **company audience**.",
    },
  },
  methods: {
    ...common.methods,
    _summarize(body) {
      const audienceName = body?.audience?.name ?? "audience";
      const companyName = body?.data?.properties?.name
        ?? body?.data?.domain
        ?? body?.data?.dd_company_id
        ?? "company";
      const id = body?.message_id
        ?? `${body?.data?.dd_company_id ?? companyName}-${body?.sent_at ?? Date.now()}`;
      const ts = body?.sent_at
        ? Date.parse(body.sent_at)
        : Date.now();
      return {
        id,
        summary: `${companyName} entered ${audienceName}`,
        ts,
      };
    },
  },
};
