import teamworkDesk from "../../teamwork_desk.app.mjs";

export default {
  props: {
    teamworkDesk,
    db: "$.service.db",
    http: "$.interface.http",
    inboxes: {
      propDefinition: [
        teamworkDesk,
        "inboxes",
      ],
    },
  },
  hooks: {
    async activate() {
      const inboxData = {};
      if (this.inboxes.includes("all")) {
        inboxData.allInboxes = true;
        inboxData.inboxes = [];
      } else {
        inboxData.allInboxes = false;
        inboxData.inboxes = this.inboxes;
      }
      const { id: webhookId } = await this.teamworkDesk.createHook({
        data: {
          active: true,
          allEvents: false,
          contentType: "application/json",
          url: this.http.endpoint,
          events: this.getWebhookEvents(),
          ...inboxData,
        },
      });

      this.setWebhookId(webhookId);
    },
    async deactivate() {
      await this.teamworkDesk.deleteHook(this.getWebhookId());
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set("hookId", webhookId);
    },
    getWebhookId() {
      return this.db.get("hookId");
    },
    getWebhookEvents() {
      throw new Error("getWebhookEvents Not implemented");
    },
    getMetadata() {
      throw new Error("getMetadata Not implemented");
    },
  },
  async run({ body }) {
    const metadata = this.getMetadata(body);
    this.$emit(body, metadata);
  },
};
