import { axios } from "@pipedream/platform";
import whop from "../../whop.app.mjs";

export default {
  key: "whop-new-membership-validated-instant",
  name: "New Membership Validated (Instant)",
  description: "Emit new event when a membership goes valid. [See the documentation](https://dev.whop.com/api-reference/v2/webhooks/create-a-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whop,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    membershipId: {
      propDefinition: [
        whop,
        "membershipId",
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
      // Fetch the 50 most recent memberships to backfill events
      // This is a placeholder as the actual method to list memberships is not provided
      const memberships = []; // Replace with API call to fetch memberships
      memberships.slice(-50).forEach((membership) => {
        this.$emit(membership, {
          id: membership.id,
          summary: `Membership ${membership.id} validated`,
          ts: Date.parse(membership.validated_at),
        });
      });
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const response = await this.whop._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          enabled: true,
          events: [
            "membership_went_valid",
          ],
          url: webhookUrl,
        },
      });
      const { id } = response;
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.whop._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    const { body } = event;

    if (body.event === "membership_went_valid" && body.data.membership_id === this.membershipId) {
      this.$emit(body, {
        id: body.data.membership_id,
        summary: "Membership went valid",
        ts: Date.parse(body.created_at),
      });
    }

    this.http.respond({
      status: 200,
    });
  },
};
