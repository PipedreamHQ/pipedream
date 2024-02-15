import { axios } from "@pipedream/platform";
import aevent from "../../aevent.app.mjs";

export default {
  key: "aevent-new-registration",
  name: "New User Registration",
  description: "Emits an event whenever a user registers for an event. [See the documentation]()", // Placeholder for documentation link
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    aevent,
    db: "$.service.db",
    userId: {
      propDefinition: [
        aevent,
        "userId",
      ],
    },
    eventId: {
      propDefinition: [
        aevent,
        "eventId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 registrations and emit them
      const lastRegistrations = this.db.get("lastRegistrations") || [];
      const sliceIndex = Math.max(lastRegistrations.length - 50, 0);
      const recentRegistrations = lastRegistrations.slice(sliceIndex);

      for (const registration of recentRegistrations) {
        this.$emit(registration, {
          id: registration.id,
          summary: registration.summary,
          ts: registration.ts,
        });
      }
    },
    async activate() {
      // Placeholder for webhook subscription if needed
    },
    async deactivate() {
      // Placeholder for webhook deletion if needed
    },
  },
  async run() {
    // Register a new user for an event and emit the registration event
    const {
      userId, eventId,
    } = this;
    await this.aevent.registerUserForEvent({
      userId,
      eventId,
    });

    // Save the emitted event to the database
    const lastRegistrations = this.db.get("lastRegistrations") || [];
    const newRegistration = {
      id: `${userId}-${eventId}`,
      summary: `New user ${userId} registered for event ${eventId}`,
      ts: Date.now(),
    };

    lastRegistrations.unshift(newRegistration);
    // Only keep the last 50 registrations
    this.db.set("lastRegistrations", lastRegistrations.slice(0, 50));

    // Emit the new user registration event
    this.$emit(newRegistration, {
      id: newRegistration.id,
      summary: newRegistration.summary,
      ts: newRegistration.ts,
    });
  },
};
