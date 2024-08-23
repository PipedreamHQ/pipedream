import konfhub from "../../konfhub.app.mjs";

export default {
  key: "konfhub-new-registration-added-instant",
  name: "New Registration Added (Instant)",
  description: "Emits an event for each new registration added for a selected event. [See the documentation](https://docs.konfhub.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    konfhub,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5, // 5 minutes
      },
    },
    eventReference: {
      propDefinition: [
        konfhub,
        "eventReference",
      ],
    },
  },
  hooks: {
    async deploy() {
      const lastRun = this.db.get("lastRun") || 0;
      const now = Date.now();

      const newRegistrations = await this.konfhub.emitEventForNewRegistration({
        eventReference: this.eventReference,
        since: lastRun,
      });

      for (const registration of newRegistrations) {
        this.$emit(registration, {
          id: registration.id,
          summary: `New registration: ${registration.name}`,
          ts: registration.timestamp,
        });
      }

      this.db.set("lastRun", now);
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun");
    const now = Date.now();

    const newRegistrations = await this.konfhub.emitEventForNewRegistration({
      eventReference: this.eventReference,
      since: lastRun,
    });

    for (const registration of newRegistrations) {
      this.$emit(registration, {
        id: registration.id,
        summary: `New registration: ${registration.name}`,
        ts: registration.timestamp,
      });
    }

    this.db.set("lastRun", now);
  },
};
