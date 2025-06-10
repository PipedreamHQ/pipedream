import { axios } from "@pipedream/platform";
import prodatakey from "../../prodatakey.app.mjs";

export default {
  key: "prodatakey-new-event-instant",
  name: "New Event Instant",
  description: "Emit new event when an event is triggered. [See the documentation](https://developer.pdk.io/web/2.0/introduction)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    prodatakey,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    organizationId: {
      propDefinition: [
        prodatakey,
        "organizationId",
      ],
    },
    name: {
      propDefinition: [
        prodatakey,
        "name",
      ],
    },
    url: {
      propDefinition: [
        prodatakey,
        "url",
      ],
    },
    scope: {
      propDefinition: [
        prodatakey,
        "scope",
      ],
    },
    authenticationType: {
      propDefinition: [
        prodatakey,
        "authenticationType",
      ],
    },
    events: {
      propDefinition: [
        prodatakey,
        "events",
      ],
    },
    authenticationUser: {
      propDefinition: [
        prodatakey,
        "authenticationUser",
      ],
      optional: true,
    },
    authenticationPassword: {
      propDefinition: [
        prodatakey,
        "authenticationPassword",
      ],
      optional: true,
    },
    secret: {
      propDefinition: [
        prodatakey,
        "secret",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const events = await this.prodatakey.emitEvent({
        organizationId: this.organizationId,
        name: this.name,
        url: this.url,
        scope: this.scope,
        authenticationType: this.authenticationType,
        events: this.events,
        authenticationUser: this.authenticationUser,
        authenticationPassword: this.authenticationPassword,
        secret: this.secret,
      });

      for (const event of events.slice(0, 50)) {
        this.$emit(event, {
          id: event.id,
          summary: `Event triggered for ${event.name}`,
          ts: Date.now(),
        });
      }
    },
    async activate() {
      const webhookResponse = await axios(this, {
        method: "POST",
        url: "https://accounts.pdk.io/api/webhooks",
        headers: {
          Authorization: `Bearer ${this.prodatakey.$auth.oauth_access_token}`,
        },
        data: {
          organization_id: this.organizationId,
          name: this.name,
          url: this.url,
          scope: this.scope,
          authentication_type: this.authenticationType,
          events: this.events,
          authentication_user: this.authenticationUser,
          authentication_password: this.authenticationPassword,
          secret: this.secret,
        },
      });
      this.db.set("webhookId", webhookResponse.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `https://accounts.pdk.io/api/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.prodatakey.$auth.oauth_access_token}`,
          },
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const computedSignature = require("crypto").createHmac("sha256", this.secret || "")
      .update(JSON.stringify(body))
      .digest("base64");
    if (headers["x-pdk-signature"] !== computedSignature) {
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
    this.$emit(body, {
      id: body.id || Date.now(),
      summary: `New event: ${body.topic}`,
      ts: Date.now(),
    });
  },
};
