import klenty from "../../klenty.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "klenty-email-bounced",
  name: "Email Bounced",
  description: "Emit new event when an email to a prospect bounces. [See the documentation](https://support.klenty.com/en/articles/8193937-klenty-s-post-apis)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    klenty,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const { items: bouncedEmails } = await this.klenty.getProspectsByList({
        params: {
          event: "onmailbounce",
          start: 0,
          limit: 50,
        },
      });

      if (!bouncedEmails || bouncedEmails.length === 0) {
        console.log("No bounced emails found during deploy.");
        return;
      }

      bouncedEmails.forEach((email) => {
        this.$emit(email, {
          id: email.id || `${email.Email}-${Date.now()}`,
          summary: `Email to ${email.Email} bounced`,
          ts: Date.parse(email.DateBounced) || Date.now(),
        });
      });
    },
    async activate() {
      const { id } = await this.klenty.createWebhook({
        event: "onmailbounce",
      });
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.klenty.deleteWebhook({
          id: webhookId,
        });
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    const secret = this.db.get("secret");
    const signatureHeader = headers["X-Klenty-Signature"];

    if (!signatureHeader) {
      this.http.respond({
        status: 401,
        body: "Missing signature",
      });
      return;
    }

    const computedSignature = crypto.createHmac("sha256", secret).update(JSON.stringify(body))
      .digest("hex");
    if (signatureHeader !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "Webhook received",
    });

    this.$emit(body, {
      id: body.id || `${body.Email}-${Date.now()}`,
      summary: `Email to ${body.Email} bounced`,
      ts: Date.parse(body.DateBounced) || Date.now(),
    });
  },
};
