import shift4 from "../../shift4.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shift4-charge-updated-instant",
  name: "Charge Updated (Instant)",
  description: "Emits an event when a charge object is updated. [See the documentation](https://dev.shift4.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    shift4: {
      type: "app",
      app: "shift4",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    orderIdentifier: shift4.propDefinitions.orderIdentifier,
  },
  hooks: {
    async activate() {
      // Placeholder for webhook subscription logic if needed
    },
    async deactivate() {
      // Placeholder for webhook unsubscription logic if needed
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "",
    });

    const { body } = event;

    if (body.type !== "CHARGE_UPDATED") {
      this.http.respond({
        status: 200,
        body: "Event type is not CHARGE_UPDATED or orderIdentifier does not match.",
      });
      return;
    }

    if (body.data.orderIdentifier !== this.orderIdentifier) {
      this.http.respond({
        status: 200,
        body: "Event type is not CHARGE_UPDATED or orderIdentifier does not match.",
      });
      return;
    }

    const chargeUpdatedEvent = {
      id: body.data.id,
      summary: `Charge ${body.data.id} updated`,
      ts: Date.parse(body.data.updatedAt || new Date()),
    };
    this.$emit(body.data, chargeUpdatedEvent);
  },
};
