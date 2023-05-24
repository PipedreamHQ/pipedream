import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  props: {
    teamleaderFocus,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      const events = await this.getHistoricalEvents();
      for (const event of events.reverse()) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    },
    async activate() {
      await this.teamleaderFocus.createWebhook({
        data: {
          url: this.http.endpoint,
          types: [
            this.getEventType(),
          ],
        },
      });
    },
    async deactivate() {
      await this.teamleaderFocus.deleteWebhook({
        data: {
          url: this.http.endpoint,
          types: [
            this.getEventType(),
          ],
        },
      });
    },
  },
  methods: {
    getHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getResource() {
      throw new Error("getResource is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const resource = await this.getResource(body);
    const meta = this.generateMeta(resource);
    this.$emit(resource, meta);
  },
};
