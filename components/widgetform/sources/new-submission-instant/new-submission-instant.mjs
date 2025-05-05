import widgetform from "../../widgetform.app.mjs";

export default {
  key: "widgetform-new-submission-instant",
  name: "New Form Submission (Instant)",
  description: "Emit new event when a form submission is received. [See the documentation](https://usewidgetform.notion.site/Zapier-API-185312164ccf808eb902f411608aa35d)",
  version: "0.0.1",
  type: "source",
  props: {
    widgetform,
    db: "$.service.db",
    http: "$.interface.http",
    form: {
      propDefinition: [
        widgetform,
        "form",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.widgetform.createSubscription({
        data: {
          hook_url: this.http.endpoint,
        },
      });
      if (!id) {
        throw new Error("Error creating subscription");
      }
      this._setSubscriptionId(id);
    },
    async deactivate() {
      const id = this._getSubscriptionId();
      if (!id) {
        return;
      }
      await this.widgetform.deleteSubscription({
        data: {
          subscription_id: id,
        },
      });
    },
    async deploy() {
      const response = await this.widgetform.listResponses();
      if (!response?.length) {
        return;
      }
      const submissions = this.form
        ? response.filter(({ form_name }) => form_name === this.form)
        : response;
      submissions.reverse().forEach((submission) => {
        const meta = this.generateMeta(submission);
        this.$emit(submission, meta);
      });
    },
  },
  methods: {
    _getSubscriptionId() {
      return this.db.get("subscriptionId");
    },
    _setSubscriptionId(subscriptionId) {
      this.db.set("subscriptionId", subscriptionId);
    },
    generateMeta(submission) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `New Submission for ${submission.form_name}`,
        ts,
      };
    },
  },
  async run(event) {
    const submission = event.body;
    if (!submission || (this.form && (submission.form_name !== this.form))) {
      return;
    }
    const meta = this.generateMeta(submission);
    this.$emit(submission, meta);
  },
};
