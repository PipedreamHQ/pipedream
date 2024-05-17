import { v4 as uuidv4 } from "uuid";
import boloforms from "../../boloforms.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  props: {
    boloforms,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhookName: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook to identify on the BoloForms platform.",
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("webhookId", hookId);
    },
    _getHookId() {
      return this.db.get("webhookId");
    },
    getDocs() {
      return this.documentId;
    },
    generateMeta(body) {
      const ts = Date.now();
      return {
        id: `${body.documentId}-${ts}`,
        summary: this.getSummary(body),
        ts: ts,
      };
    },
  },
  hooks: {
    async activate() {
      const uuid = uuidv4();
      const response = await this.boloforms.updateHooks({
        data: {
          "task": "ADD",
          "webhookObj": {
            "webhookId": uuid,
            "webhookName": this.webhookName,
            "webhookUrl": this.http.endpoint,
            "webhookEvent": this.getWebhookEvent(),
            "selectedDocs": parseObject(this.getDocs()),
            "webhookStatus": "ACTIVE",
          },
        },
      });

      const newHook = response.owner.webhooks.filter((hook) => hook.webhookId === uuid);

      this._setHookId({
        webhookId: uuid,
        _id: newHook[0]._id,
      });
    },
    async deactivate() {
      await this.boloforms.updateHooks({
        data: {
          "task": "DELETE",
          "webhookObj": this._getHookId(),
        },
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
      body: "Success",
    });
    if (!Array.isArray(body)) {
      body = [
        body,
      ];
    }
    body.forEach((item) => this.$emit(item, this.generateMeta(item)));
  },
};
