import _1crm from "../../_1crm.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "_1crm-new-or-updated-lead-instant",
  name: "New or Updated Lead Instant",
  description: "Emit new event when a lead is updated or created. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    _1crm: {
      type: "app",
      app: "_1crm",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    leadDetails: {
      propDefinition: [
        _1crm,
        "leadDetails",
      ],
    },
    leadStatus: {
      propDefinition: [
        _1crm,
        "leadStatus",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const leads = await this._1crm._makeRequest({
        method: "GET",
        path: "/data/Leads",
        params: {
          order_by: "date_modified DESC",
          limit: 50,
        },
      });

      for (const lead of leads) {
        this.$emit(lead, {
          id: lead.id,
          summary: `New or updated lead: ${lead.name}`,
          ts: Date.parse(lead.date_modified),
        });
      }
    },
    async activate() {
      const webhook = await this._1crm.createWebhook({
        type: "create_update",
        url: this.http.endpoint,
        model: "Leads",
        filters: {
          glue: "and",
          conditions: [
            {
              field: "details",
              value: this.leadDetails,
            },
            {
              field: "status",
              value: this.leadStatus,
            },
          ],
        },
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this._1crm.updateWebhook({
          id,
          type: "delete",
        });
      }
    },
  },
  async run(event) {
    const rawBody = event.bodyRaw;
    const webhookSignature = event.headers["x-signature"];
    const secretKey = this._1crm.$auth.oauth_access_token;

    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");
    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New or updated lead: ${event.body.name}`,
      ts: Date.parse(event.body.date_modified),
    });
  },
};
