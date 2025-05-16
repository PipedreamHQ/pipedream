import selzy from "../../selzy.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "selzy-new-campaign-instant",
  name: "New Campaign Created",
  description: "Emit new event when a new email campaign is created. Useful for monitoring campaign creation activity. [See the documentation](https://selzy.com/en/support/category/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    selzy,
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
  },
  hooks: {
    async deploy() {
      const campaigns = await this.selzy.getCampaigns({
        paginate: true,
        max: 50,
      });
      for (const campaign of campaigns) {
        this.$emit(campaign, {
          id: campaign.id,
          summary: `New campaign created: ${campaign.name}`,
          ts: Date.parse(campaign.createdAt),
        });
      }
    },
    async activate() {
      const response = await this.selzy._makeRequest({
        method: "POST",
        path: "/setHook",
        data: {
          api_key: this.selzy.$auth.api_key,
          hook_url: this.http.endpoint,
          event_format: "json_post",
          events: [
            "campaign_status",
          ],
          status: "active",
        },
      });
      this._setWebhookId(response.hook_id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.selzy._makeRequest({
          method: "POST",
          path: "/removeHook",
          data: {
            hook_id: webhookId,
          },
        });
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-selzy-signature"];
    const secret = this.selzy.$auth.api_key;
    const computedSignature = crypto.createHmac("sha256", secret)
      .update(event.body)
      .digest("base64");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const { events_by_user } = event.body;
    for (const userEvents of events_by_user) {
      for (const eventData of userEvents.Events) {
        if (eventData.event_name === "campaign_status") {
          this.$emit(eventData, {
            id: eventData.event_data.campaign_id,
            summary: `New campaign status: ${eventData.event_data.status}`,
            ts: Date.parse(eventData.event_time),
          });
        }
      }
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
