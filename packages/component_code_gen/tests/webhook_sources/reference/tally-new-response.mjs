export default {
  key: "tally-new-response",
  name: "New Response",
  description: "Emit new event on each form message. [See docs here](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    tally: {
      type: "app",
      app: "tally",
    },
    formId: {
      label: "Form",
      description: "Select a form",
      type: "string",
      async options() {
        const forms = await this.getForms();

        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const response = await this.tally.createWebhook({
        formId: this.formId,
        url: this.http.endpoint,
        eventTypes: this.getWebhookEventTypes(),
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.tally.removeWebhook(webhookId);
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEventTypes() {
      return [
        "FORM_RESPONSE",
      ];
    },
    emitEvent(event) {
      const { data: response } = event;

      this.$emit(response, {
        id: response.responseId,
        summary: `New response for ${response.formName} form`,
        ts: response.createdAt,
      });
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
