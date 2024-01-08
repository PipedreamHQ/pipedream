import storyscale from "../../storyscale.app.mjs";

export default {
  key: "storyscale-tour-published-instant",
  name: "Tour Published Instant",
  description: "Emits an event when a tour gets published",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    storyscale,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    tourName: storyscale.propDefinitions.tourName,
    publishedTimestamp: {
      ...storyscale.propDefinitions.publishedTimestamp,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.storyscale.createEvent({
        data: {
          event: "tour.published",
          webhookUrl: this.http.endpoint,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      await this.storyscale.deleteEvent({
        id: this.db.get("webhookId"),
      });
    },
  },
  async run(event) {
    const body = event.body;
    const meta = body.meta;
    if (meta && meta.tourName === this.tourName) {
      this.$emit(body, {
        id: body.id,
        summary: `Tour ${body.meta.tourName} was published`,
        ts: Date.now(),
      });
    } else {
      console.log("Tour name does not match the specified name, skipping emit");
    }
  },
};
