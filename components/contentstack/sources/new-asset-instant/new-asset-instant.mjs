import contentstack from "../../contentstack.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "contentstack-new-asset-instant",
  name: "New Asset Created",
  description: "Emit a new event when a new asset is created in Contentstack. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    contentstack: {
      type: "app",
      app: "contentstack",
    },
    stackId: {
      propDefinition: [
        contentstack,
        "stackId",
      ],
    },
    assetId: {
      propDefinition: [
        contentstack,
        "assetId",
      ],
    },
    secretKey: {
      type: "string",
      label: "Secret Key",
      description: "Secret key for validating webhook signatures",
      secret: true,
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    async _createWebhook() {
      const webhookData = {
        name: "Pipedream Webhook for New Asset Creation",
        url: this.http.endpoint,
        events: [
          "asset.create",
        ],
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await this.contentstack._makeRequest({
        method: "POST",
        path: `/stacks/${this.stackId}/webhooks`,
        data: webhookData,
      });

      return response.uid;
    },
    async _deleteWebhook(webhookId) {
      await this.contentstack._makeRequest({
        method: "DELETE",
        path: `/stacks/${this.stackId}/webhooks/${webhookId}`,
      });
    },
    async _listRecentAssets() {
      const assets = await this.contentstack.paginate(this.contentstack.listAssets, {
        include_total_count: true,
        limit: 50,
      });
      return assets.slice(-50);
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this._createWebhook();
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this._deleteWebhook(webhookId);
        await this.db.delete("webhookId");
      }
    },
    async deploy() {
      const recentAssets = await this._listRecentAssets();
      for (const asset of recentAssets) {
        this.$emit(
          {
            stackId: this.stackId,
            assetId: asset.uid,
          },
          {
            id: `${this.stackId}-${asset.uid}`,
            summary: `New asset created with ID: ${asset.uid}`,
            ts: new Date(asset.created_at),
          },
        );
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-contentstack-signature"];
    const rawBody = JSON.stringify(event.body);
    const computedSignature = crypto
      .createHmac("sha256", this.secretKey)
      .update(rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const asset = event.body;
    const assetId = asset.uid || asset.asset_uid || asset.asset_id;
    const stackId = this.stackId;

    if (!assetId) {
      this.$emit(
        {
          stackId,
          assetId: "unknown",
        },
        {
          id: `${stackId}-unknown`,
          summary: "New asset created with unknown ID",
          ts: new Date(),
        },
      );
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }

    this.$emit(
      {
        stackId,
        assetId,
      },
      {
        id: `${stackId}-${assetId}`,
        summary: `New asset created with ID: ${assetId}`,
        ts: new Date(asset.created_at),
      },
    );

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
