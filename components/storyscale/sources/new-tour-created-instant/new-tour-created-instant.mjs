import storyscale from "../../storyscale.app.mjs";

export default {
  key: "storyscale-new-tour-created-instant",
  name: "New Tour Created Instant",
  description: "Emit new event when a new tour is created. [See the documentation](https://prodapi.storyscale.com/api/documentation)",
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
    tourName: {
      propDefinition: [
        storyscale,
        "tourName",
      ],
    },
    tourDateTime: {
      propDefinition: [
        storyscale,
        "tourDateTime",
      ],
    },
  },
  hooks: {
    async activate() {
      const opts = {
        method: "POST",
        path: "/v1/tour/create/",
        data: {
          name: this.tourName,
          dateTime: this.tourDateTime,
        },
      };
      const { data } = await this.storyscale._makeRequest(opts);
      this.db.set("tourId", data.id);
    },
    async deactivate() {
      const id = this.db.get("tourId");
      await this.storyscale.deleteEvent(id);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["X-StoryScale-Signature"] !== this.storyscale.$auth.webhook_signature) {
      this.http.respond({
        status: 401,
      });
      return;
    }

    if (body.tour && body.tour.id === this.db.get("tourId")) {
      this.$emit(body, {
        id: body.id,
        summary: `New tour created: ${body.tour.name}`,
        ts: Date.now(),
      });
    }
  },
};
