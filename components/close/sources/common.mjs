import close from "../close.app.mjs";

export default {
  props: {
    close,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    async activate({ events }) {
      console.log("activating");
      const response = await this.close.createHook({
        data: {
          events,
          url: this.http.endpoint,
        },
      });
      console.log("activate", response);
      this.db.set("hookId", response.data.id);
      //this.db.set("hookId", response.id);
    },
  },
  hooks: {
    async deactivate() {
      const hookId = this.db.get("hookId");
      await this.close.deleteHook({
        hookId,
      });
    },
  },
  async run(event) {
    this.$emit({
      event,
    },
    {
      id: event.id,
      ts: Date.parse(event.date_created),
      summary: `New event (ID:${event.id})`,
    });
  },
};
