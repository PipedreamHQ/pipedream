import { SCOPE_OPTIONS } from "../../common/constants.mjs";
import papersign from "../../papersign.app.mjs";

export default {
  props: {
    papersign,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    folderId: {
      propDefinition: [
        papersign,
        "folderId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook.",
      optional: true,
    },
    scope: {
      type: "string",
      label: "Scope",
      description: "The scope of the webhook",
      options: SCOPE_OPTIONS,
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const { results: { webhook } } = await this.papersign.createWebhook({
        folderId: this.folderId,
        data: {
          name: this.name,
          target_url: this.http.endpoint,
          scope: this.scope,
          triggers: this.getTriggers(),
        },
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.papersign.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: Date.parse(body.created_at),
    });
  },
};
