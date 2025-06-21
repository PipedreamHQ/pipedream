import CryptoJS from "crypto-js";
import { EVENT_OPTIONS } from "../../common/constants.mjs";
import picqer from "../../picqer.app.mjs";

export default {
  props: {
    picqer,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    warehouseId: {
      propDefinition: [
        picqer,
        "warehouseId",
      ],
    },
    event: {
      type: "string",
      label: "Event",
      description: "The event to emit.",
      options: EVENT_OPTIONS,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Your own reference for this hook.",
    },
    secret: {
      type: "string",
      label: "Secret",
      description: "If you provide a secret key with your webhook, we will use it to sign every request so you can check the sender.",
      optional: true,
      secret: true,
    },
  },
  hooks: {
    async activate() {
      const response = await this.picqer.createHook({
        data: {
          event: this.event,
          address: this.http.endpoint,
          secret: this.secret,
          name: this.name,
        },
      });
      this.db.set("webhookId", response.idhook);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.picqer.deleteHook(webhookId);
    },
  },
  async run(event) {
    const { body } = event;
    const signature = event?.headers["x-picqer-signature"];
    if (signature) {
      const hash = CryptoJS.HmacSHA256(event.bodyRaw, this.secret);
      const hashBase64 = CryptoJS.enc.Base64.stringify(hash);

      if (hashBase64 !== signature) {
        this.http.respond({
          status: 401,
          body: "Unauthorized",
        });
        return;
      }
    }

    this.http.respond({
      status: 200,
      body: "Success",
    });

    const ts = Date.parse(body.event_triggered_at);

    this.$emit(body, {
      id: `${body.idhook}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
