import { axios } from "@pipedream/platform";
import kommo from "../../kommo.app.mjs";

export default {
  key: "kommo-new-company-instant",
  name: "New Company Created",
  description: "Emit new event when a company is created. [See the documentation](https://www.kommo.com/developers/content/api_v4/webhooks-2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kommo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const webhook = await this.kommo.addWebhook(this._webhookUrl(), [
        "add_company",
      ]);
      this.db.set("webhookId", webhook.id);
    },
    async activate() {
      const webhook = await this.kommo.addWebhook(this._webhookUrl(), [
        "add_company",
      ]);
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.kommo._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  methods: {
    _webhookUrl() {
      return this.$emit;
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New Company: ${body.name}`,
      ts: Date.parse(body.created_at),
    });
  },
};
