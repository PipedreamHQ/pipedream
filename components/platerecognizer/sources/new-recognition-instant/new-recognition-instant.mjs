import { axios } from "@pipedream/platform";
import platerecognizer from "../../platerecognizer.app.mjs";

export default {
  key: "platerecognizer-new-recognition-instant",
  name: "New Recognition Instant",
  description: "Emits new event when a cloud webhook event is broadcasted.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    platerecognizer,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      console.log("Deploying new recognition instant source");
    },
    async activate() {
      console.log("Activating new recognition instant source");
    },
    async deactivate() {
      console.log("Deactivating new recognition instant source");
    },
  },
  async run(event) {
    const body = event.body;
    if (!body) {
      this.http.respond({
        status: 400,
        body: "No data received",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "Success",
    });

    const eventData = {
      hook: body.hook,
      data: body.data,
    };

    this.$emit(eventData, {
      id: eventData.data.timestamp,
      summary: `New Recognition: ${eventData.data.results.map((result) => result.plate).join(", ")}`,
      ts: Date.parse(eventData.data.timestamp),
    });
  },
};
