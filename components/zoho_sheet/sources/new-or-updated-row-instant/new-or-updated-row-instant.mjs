import zohoSheet from "../../zoho_sheet.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_sheet-new-or-updated-row-instant",
  name: "New or Updated Row Instant",
  description: "Emit new event whenever a row is added or modified. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zohoSheet,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    worksheet: {
      propDefinition: [
        zohoSheet,
        "worksheet",
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
    async _emitEvent(event) {
      this.$emit(event, {
        id: `${event.id}-${new Date().getTime()}`,
        summary: `Row ${event.type} in worksheet`,
        ts: new Date(),
      });
    },
  },
  hooks: {
    async deploy() {
      try {
        const events = await this.zohoSheet.emitNewRowEvent({
          worksheet: this.worksheet,
        });
        for (const event of events) {
          await this._emitEvent(event);
        }
      } catch (error) {
        console.error("Error during deploy:", error);
      }
    },
    async activate() {
      const hookId = await this.zohoSheet.emitRowChangeEvent({
        worksheet: this.worksheet,
      });
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        // Assuming a method to delete webhook has a similar signature
        await this.zohoSheet.deleteWebhook({
          worksheet: this.worksheet,
          webhookId: id,
        });
      }
    },
  },
  async run(event) {
    try {
      const signature = event.headers["x-zoho-signature"];
      const rawBody = event.rawBody;
      const computedSignature = crypto.createHmac("sha256", this.zohoSheet.$auth.oauth_access_token).update(rawBody)
        .digest("base64");

      if (signature !== computedSignature) {
        this.http.respond({
          status: 401,
          body: "Unauthorized",
        });
        return;
      }

      const { data } = event.body;
      await this._emitEvent(data);

      this.http.respond({
        status: 200,
        body: "OK",
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      this.http.respond({
        status: 500,
        body: "Error",
      });
    }
  },
};
