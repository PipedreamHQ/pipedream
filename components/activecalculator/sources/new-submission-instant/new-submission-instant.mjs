import activecalculator from "../../activecalculator.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "activecalculator-new-submission-instant",
  name: "New Submission (Instant)",
  description: "Emit new event when there's a new submission.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    activecalculator,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook.",
      optional: true,
    },
    calculatorIds: {
      propDefinition: [
        activecalculator,
        "calculatorIds",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.activecalculator.createWebhook({
        data: {
          url: this.http.endpoint,
          name: this.name,
          source: "pipedream",
          triggers: [
            "newSubmission",
          ],
          calculators: parseObject(this.calculatorIds),
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.activecalculator.deleteWebhook(webhookId);
      }
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.data.id,
      summary: `New Submission: ${body.data.id}`,
      ts: Date.parse(body.data.createdAt),
    });
  },
  sampleEmit,
};
