import goformz from "../../goformz.app.mjs";

export default {
  key: "goformz-new-form-completed",
  name: "New Form Completed",
  description: "Emit new event when a new form is completed in GoFormz",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    goformz,
    db: "$.service.db",
    http: "$.interface.http",
    templateId: {
      propDefinition: [
        goformz,
        "templateId",
      ],
      description: "The ID of the template to watch for form completions",
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.goformz.createWebhook({
        data: {
          eventType: "form.complete",
          targetUrl: this.http.endpoint,
          entityId: this.templateId,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.goformz.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(form) {
      return {
        id: form.formId,
        summary: `New Form Completed: ${form.name}`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const form = await this.goformz.getForm({
      formId: body.Item.Id,
    });
    const meta = this.generateMeta(form);
    this.$emit(form, meta);
  },
};
