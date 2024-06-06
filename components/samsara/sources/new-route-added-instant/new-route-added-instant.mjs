import samsara from "../../samsara.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "samsara-new-route-added-instant",
  name: "New Route Added Instant",
  description: "Emit new event when a new route is added to Samsara. Required prop is the route name.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    samsara,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    routeName: {
      propDefinition: [
        samsara,
        "routeName",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Placeholder for deploy logic, if needed
    },
    async activate() {
      // Placeholder for activate logic, if needed
    },
    async deactivate() {
      // Placeholder for deactivate logic, if needed
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: {},
    });

    const routeName = this.routeName; // Using the routeName prop in the run method
    console.log(`New route added: ${routeName}`);
    // Emitting the event with a unique ID (timestamp) and relevant information
    this.$emit(event.body, {
      id: `${Date.now()}`,
      summary: `New route added: ${routeName}`,
      ts: Date.now(),
    });
  },
};
