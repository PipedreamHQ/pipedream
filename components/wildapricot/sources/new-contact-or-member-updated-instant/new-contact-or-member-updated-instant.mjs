import wildapricot from "../../wildapricot.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "wildapricot-new-contact-or-member-updated-instant",
  name: "New Contact or Member Updated (Instant)",
  description: "Emit new event when a contact or member in WildApricot is updated",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    wildapricot,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    contactId: {
      propDefinition: [
        wildapricot,
        "contactId",
      ],
      optional: false,
    },
    memberId: {
      propDefinition: [
        wildapricot,
        "memberId",
      ],
      optional: false,
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this.wildapricot.createWebhook({
        url: this.http.endpoint,
        eventFilter: "Contacts.MembershipLevelChanged,Contacts.EmailChanged,Contacts.FieldChanged",
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.wildapricot.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-apicp-signature"]) {
      const hash = crypto
        .createHmac("sha1", this.wildapricot.$auth.oauth_access_token)
        .update(JSON.stringify(body))
        .digest("hex");
      if (hash === headers["x-apicp-signature"]) {
        this.http.respond({
          status: 200,
        });
        const {
          ContactId: contactId, MembershipLevel: memberId,
        } = body;
        if (contactId === this.contactId || contactId === this.memberId) {
          const contactDetails = await this.wildapricot.getContactDetails(contactId);
          this.$emit(contactDetails, {
            id: contactDetails.id,
            summary: `Contact ${contactDetails.id} updated`,
            ts: Date.now(),
          });
        }
      } else {
        this.http.respond({
          status: 401,
        });
      }
    } else {
      this.http.respond({
        status: 401,
      });
    }
  },
};
