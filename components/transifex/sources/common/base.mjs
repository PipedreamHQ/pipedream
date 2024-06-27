import transifex from "../../transifex.app.mjs";

export default {
  props: {
    transifex,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    organizationId: {
      propDefinition: [
        transifex,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        transifex,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
  methods: {
    filterEvent() {
      return true;
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.transifex.createTaskWebhook({
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
        data: {
          data: {
            attributes: {
              active: true,
              event_type: this.getEventType(),
              callback_url: this.http.endpoint,
            },
            relationships: {
              project: {
                data: {
                  id: this.projectId,
                  type: "projects",
                },
              },
            },
            type: "project_webhooks",
          },
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.transifex.deleteTaskWebhook(webhookId);
      }
    },
  },
  async run({ body }) {
    if (this.filterEvent(body)) {
      const ts = Date.parse(new Date());
      this.$emit(body, {
        id: `${body.resource}-${ts}`,
        summary: this.getSummary(body),
        ts: ts,
      });
    }

  },
};
