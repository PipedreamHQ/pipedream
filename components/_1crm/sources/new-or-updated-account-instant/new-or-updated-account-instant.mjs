import _1crm from "../../_1crm.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "_1crm-new-or-updated-account-instant",
  name: "New or Updated Account (Instant)",
  description: "Emit new event when an account is updated or created. [See the documentation](https://demo.1crmcloud.com/api.php)",
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
    accountDetails: {
      propDefinition: [
        _1crm,
        "accountDetails",
      ],
    },
    accountStatus: {
      propDefinition: [
        _1crm,
        "accountStatus",
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
      // Fetch and emit historical events
      const accounts = await this._1crm._makeRequest({
        method: "GET",
        path: "/data/Accounts",
        params: {
          max_num: 50,
        },
      });
      for (const account of accounts) {
        this.$emit(account, {
          id: account.id,
          summary: `New or updated account: ${account.name}`,
          ts: Date.parse(account.date_modified),
        });
      }
    },
    async activate() {
      const webhook = await this._1crm.createWebhook({
        type: "create_update",
        url: this.http.endpoint,
        model: "Accounts",
        filters: {
          glue: "and",
          conditions: [
            {
              field: "details",
              value: this.accountDetails,
            },
            {
              field: "status",
              value: this.accountStatus,
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
    const computedSignature = crypto.createHmac("sha256", this._1crm.$auth.secretKey)
      .update(event.body.rawBody)
      .digest("base64");
    if (computedSignature !== event.headers["x-webhook-signature"]) {
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
      summary: `New or updated account: ${event.body.name}`,
      ts: Date.parse(event.body.date_modified),
    });
  },
};
