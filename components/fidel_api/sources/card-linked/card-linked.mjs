import fidelApi from "../../fidel_api.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "fidel_api-card-linked",
  name: "Card Linked to Fidel API",
  description: "Emits an event each time a new card is linked to the Fidel API. [See the documentation](https://reference.fidel.uk/reference/intro)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fidelApi,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    programId: {
      propDefinition: [
        fidelApi,
        "programId",
      ],
    },
    url: {
      propDefinition: [
        fidelApi,
        "url",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { cards } = await this.fidelApi.listCards({
        programId: this.programId,
        limit: 50,
        start: null,
        order: "desc",
      });

      cards.forEach((card) => {
        this.$emit(card, {
          id: card.id,
          summary: `Card ${card.lastNumbers} linked`,
          ts: Date.parse(card.created),
        });
      });
    },
    async activate() {
      const webhook = await this.fidelApi.createWebhook({
        programId: this.programId,
        eventName: "card.linked",
        url: this.url,
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.fidelApi.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const signature = event.headers["fidel-signature"];
    const computedSignature = crypto
      .createHmac("sha256", this.fidelApi.$auth.oauth_access_token)
      .update(JSON.stringify(event.body))
      .digest("base64");

    if (!signature || signature !== computedSignature) {
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

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New card linked: ${event.body.lastNumbers}`,
      ts: Date.parse(event.body.created),
    });
  },
};
