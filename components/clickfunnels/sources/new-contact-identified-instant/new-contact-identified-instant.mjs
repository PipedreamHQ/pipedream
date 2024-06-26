import clickfunnels from "../../clickfunnels.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "clickfunnels-new-contact-identified-instant",
  name: "New Contact Identified (Instant)",
  description: "Emit new event when a fresh or formerly anonymous contact is identified via email address or contact number. [See the documentation](https://developers.myclickfunnels.com/reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clickfunnels: {
      type: "app",
      app: "clickfunnels",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical events to fetch for this source
    },
    async activate() {
      const webhookData = {
        url: this.http.endpoint,
        name: "New Contact Identified",
        event_type_ids: [
          "contact.identified",
        ],
      };
      const response = await axios(this, {
        method: "POST",
        url: `${this.clickfunnels._baseUrl()}/workspaces/${this.clickfunnels.$auth.workspace_id}/webhooks/outgoing/endpoints`,
        headers: {
          "Authorization": `Bearer ${this.clickfunnels.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: webhookData,
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.clickfunnels._baseUrl()}/workspaces/${this.clickfunnels.$auth.workspace_id}/webhooks/outgoing/endpoints/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.clickfunnels.$auth.oauth_access_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    const rawBody = event.bodyRaw;
    const webhookSignature = event.headers["x-clickfunnels-signature"];
    const secretKey = this.clickfunnels.$auth.oauth_access_token;

    const computedSignature = crypto.createHmac("sha256", secretKey)
      .update(rawBody)
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
    await this.clickfunnels.handleContactIdentified(event.body);
  },
};
