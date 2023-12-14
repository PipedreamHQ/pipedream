import { axios } from "@pipedream/platform";
import whop from "../../whop.app.mjs";
import crypto from "crypto";

export default {
  key: "whop-new-experience-claimed-instant",
  name: "New Experience Claimed (Instant)",
  description: "Emit new event when a user claims their experience from the Whop orders page. [See the documentation](https://dev.whop.com/api-reference/v2/webhooks/create-a-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whop,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    membershipInformation: {
      propDefinition: [
        whop,
        "membershipInformation",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical data events from the app
    },
    async activate() {
      // Create a webhook subscription
      const { id: webhookId } = await this.whop._makeRequest({
        method: "POST",
        path: "/webhooks",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          enabled: true,
          events: [
            "membership_experience_claimed",
          ],
          url: this.http.endpoint,
        },
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Delete the webhook subscription
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.whop._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the incoming webhook signature if needed
    const secret = this.whop.$auth.oauth_access_token;
    const signature = headers["X-Whop-Signature"];
    const computedSignature = crypto.createHmac("sha256", secret).update(JSON.stringify(body))
      .digest("hex");
    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event if membership information is present
    if (body.membership_information) {
      this.$emit(body, {
        id: body.id,
        summary: `New experience claimed: ${body.experience_name}`,
        ts: Date.parse(body.created_at),
      });

      // Respond to webhook
      this.http.respond({
        status: 200,
        body: "OK",
      });
    } else {
      throw new Error("Membership information is missing in the event body.");
    }
  },
};
