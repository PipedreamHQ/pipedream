import leiga from "../../leiga.app.mjs";

export default {
  props: {
    leiga,
    http: "$.interface.http",
    db: "$.service.db",
    projectId: {
      propDefinition: [
        leiga,
        "projectId",
      ],
    },
  },
  methods: {
    emitEvent(body) {
      this.$emit(body, {
        id: body.data.issue.id,
        summary: this.getSummary(body),
        ts: body.data.date,
      });
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const { data: events } = await this.leiga.listWebhookEvents({
        params: {
          projectId: this.projectId,
        },
      });
      const eventName = this.getEventName();
      const [
        { eventId },
      ] = events.filter((event) => (event.typeCode === "issue" && event.eventName === eventName));

      const { data: { webhookId } } = await this.leiga.createHook({
        data: {
          name: `Pipedream webhook - New ${eventName}d issue`,
          state: "enabled",
          type: "ligaAI",
          projectId: this.projectId,
          eventIds: [
            eventId,
          ],
          url: this.http.endpoint,
        },
      });
      this.setHookId(webhookId);
    },
    async deactivate() {
      const hookId = this.getHookId();
      await this.leiga.deleteHook({
        data: {
          webhookId: hookId,
        },
      });
    },
  },
  async run({ body }) {
    this.emitEvent(body);
  },
};
