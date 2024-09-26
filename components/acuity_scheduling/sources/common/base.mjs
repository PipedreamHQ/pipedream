import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  props: {
    acuityScheduling,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const response = await this.acuityScheduling.createHook({
        data: {
          event: this.getEvent(),
          target: this.http.endpoint,
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.acuityScheduling.deleteHook(webhookId);
    },
  },
  async run(event) {
    const { body } = event;

    const details = await this.acuityScheduling.getAppointment({
      id: body.id,
    });

    this.http.respond({
      status: 200,
      body: "Success",
    });

    const ts = Date.parse(details.datetime) || Date.now();

    this.$emit(details, {
      id: details.id,
      summary: this.getSummary(details),
      ts: ts,
    });
  },
};
