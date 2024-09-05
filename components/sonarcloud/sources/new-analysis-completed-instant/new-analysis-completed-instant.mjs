import sonarcloud from "../../sonarcloud.app.mjs";

export default {
  key: "sonarcloud-new-analysis-completed-instant",
  name: "New Analysis Completed (Instant)",
  description: "Emit new event when a new analisys is completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sonarcloud,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "Name displayed in the administration console of webhooks.",
    },
    organization: {
      propDefinition: [
        sonarcloud,
        "organization",
      ],
    },
    project: {
      propDefinition: [
        sonarcloud,
        "project",
        ({ organization }) => ({
          organization,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { webhook } = await this.sonarcloud.createWebhook({
        params: {
          name: this.name,
          organization: this.organization,
          project: this.project,
          url: this.http.endpoint,
        },
      });
      this.db.set("hookId", webhook.key);
    },
    async deactivate() {
      await this.sonarcloud.deleteWebhook({
        params: {
          webhook: this.db.get("hookId"),
        },
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;

    this.$emit(body, {
      id: body.revision,
      summary: `New analisys completed with revision key: ${body.revision}`,
      ts: Date.parse(body.changedAt),
    });
  },
};
