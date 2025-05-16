import selzy from "../../selzy.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "selzy-new-campaign-status-instant",
  name: "New Campaign Status Instant",
  description: "Emit a new event when the status of a campaign changes. [See the documentation](https://selzy.com/en/support/api/common/event-notification-system-webhooks/)",
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
    campaignId: {
      propDefinition: [
        selzy,
        "campaignId",
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
    _generateAuth(authBody) {
      return crypto.createHash("md5").update(authBody)
        .digest("hex");
    },
  },
  hooks: {
    async deploy() {
      const recentCampaigns = await this.selzy.getCampaigns({
        paginate: true,
        max: 50,
      });
      for (const campaign of recentCampaigns) {
        this.$emit(campaign, {
          id: campaign.id,
          summary: `New campaign status: ${campaign.status}`,
          ts: new Date(campaign.modified).getTime(),
        });
      }
    },
    async activate() {
      const hookUrl = this.http.endpoint;
      const hookId = await this.selzy._makeRequest({
        method: "POST",
        path: "/setHook",
        data: {
          api_key: this.selzy.$auth.api_key,
          hook_url: hookUrl,
          event_format: "json_post",
          events: {
            campaign_status: this.campaignId
              ? [
                this.campaignId,
              ]
              : [
                "*",
              ],
          },
          single_event: 0,
          status: "active",
        },
      });
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const hookId = this._getWebhookId();
      await this.selzy._makeRequest({
        method: "POST",
        path: "/deleteHook",
        data: {
          api_key: this.selzy.$auth.api_key,
          id: hookId,
        },
      });
    },
  },
  async run(event) {
    const signature = event.headers["selzy-signature"];
    const computedSignature = this._generateAuth(JSON.stringify(event.body).replace(event.body.auth, this.selzy.$auth.api_key));

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });

    const { events_by_user } = event.body;
    for (const userEvents of events_by_user) {
      for (const eventData of userEvents.Events) {
        if (eventData.event_name === "campaign_status") {
          this.$emit(eventData.event_data, {
            id: `${eventData.event_time}-${eventData.event_data.campaign_id}`,
            summary: `Campaign status updated to ${eventData.event_data.status}`,
            ts: new Date(eventData.event_time).getTime(),
          });
        }
      }
    }
  },
};
