import invisionCommunity from "../../invision_community.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "invision_community-new-member-instant",
  name: "New Member Instant",
  description: "Emit new event when a new member account is created. [See the documentation](https://invisioncommunity.com/developers/rest-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    invisionCommunity: {
      type: "app",
      app: "invision_community",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data to fetch
    },
    async activate() {
      const response = await axios(this, {
        method: "POST",
        url: `${this.invisionCommunity._baseUrl()}/core/webhooks`,
        headers: {
          Authorization: `Bearer ${this.invisionCommunity.$auth.api_key}`,
        },
        data: {
          url: this.http.endpoint,
          event: "member_create",
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.invisionCommunity._baseUrl()}/core/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.invisionCommunity.$auth.api_key}`,
          },
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac("sha256", this.invisionCommunity.$auth.api_secret).update(event.body_raw)
      .digest("base64");
    if (computedSignature !== event.headers["x-invision-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    await this.invisionCommunity.emitNewMemberCreateEvent(event.body);
  },
};
