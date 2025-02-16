import lambdatest from "../../lambdatest.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lambdatest-new-build-test-instant",
  name: "New Build or Test Executed",
  description: "Emit new event when a build or test is executed in LambdaTest. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    lambdatest: {
      type: "app",
      app: "lambdatest",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const events = await this.lambdatest.emitBuildOrTestEvent({
        paginate: true,
        max: 50,
      });
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          summary: `New event: ${event.name}`,
          ts: Date.parse(event.ts),
        });
      }
    },
    async activate() {
      const webhookId = await this.lambdatest.emitBuildOrTestEvent({
        method: "POST",
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.lambdatest.emitBuildOrTestEvent({
          method: "DELETE",
          data: {
            id: webhookId,
          },
        });
      }
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
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New build/test executed: ${event.body.name}`,
      ts: Date.parse(event.body.timestamp),
    });
  },
};
