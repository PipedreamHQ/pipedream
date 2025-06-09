import picqer from "../../picqer.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "picqer-new-picklist-instant",
  name: "New Picklist Instant",
  description: "Emit new event when a new pick list is created in Picqer. [See the documentation](https://picqer.com/en/api/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    picqer,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    warehouseId: {
      propDefinition: [
        picqer,
        "warehouseId",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        picqer,
        "status",
      ],
      optional: true,
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
      const picklists = await this.picqer._makeRequest({
        path: "/picklists",
      });

      picklists.slice(-50).forEach((picklist) => {
        this.$emit(picklist, {
          id: picklist.idpicklist,
          summary: `New picklist created: ${picklist.idpicklist}`,
          ts: Date.parse(picklist.datecreated),
        });
      });
    },
    async activate() {
      const webhook = await this.picqer._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "picklists.created",
          url: this.http.endpoint,
        },
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.picqer._makeRequest({
          method: "DELETE",
          path: `/webhooks/${id}`,
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-picqer-signature"];
    const body = event.body_raw;
    const secret = this.picqer.$auth.api_key;

    const computedSignature = crypto.createHmac("sha256", secret)
      .update(body)
      .digest("base64");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const { body: picklist } = event;
    if (
      (!this.warehouseId || this.warehouseId === picklist.idwarehouse) &&
      (!this.status || this.status === picklist.status)
    ) {
      this.$emit(picklist, {
        id: picklist.idpicklist,
        summary: `New picklist created: ${picklist.idpicklist}`,
        ts: Date.parse(picklist.datecreated),
      });
    }

    this.http.respond({
      status: 200,
    });
  },
};
