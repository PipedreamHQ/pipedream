import dropboard from "../../dropboard.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dropboard-new-client-member-instant",
  name: "New Client Member Instant",
  description: "Emit new event when a member is added to a recruiting client (recruiter plan only). [See the documentation](https://dropboard.readme.io/reference/webhooks-client-members)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dropboard,
    db: "$.service.db",
    clientId: {
      propDefinition: [
        dropboard,
        "clientId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const webhook = await this.dropboard.createMemberWebhook({
        data: {
          url: this.$endpoint,
          clientId: this.clientId,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async activate() {
      const webhook = await this.dropboard.createMemberWebhook({
        data: {
          url: this.$endpoint,
          clientId: this.clientId,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.dropboard._baseUrl()}/clients/members/webhooks`,
          headers: {
            Authorization: `Bearer ${this.dropboard.$auth.oauth_access_token}`,
          },
          data: {
            id: webhookId,
          },
        });
      }
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id || body.ts,
      summary: `New member added to client ${body.clientId}`,
      ts: body.ts
        ? Date.parse(body.ts)
        : Date.now(),
    });
  },
};
