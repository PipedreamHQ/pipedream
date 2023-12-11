import app from "../../nimble.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Contact Created",
  version: "0.0.1",
  key: "nimble-new-contact-created",
  description: "Emit new event when a contact is created.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: `${data.id}`,
        summary: `New contact created with ID ${data.id}`,
        ts: Date.parse(data.created),
      });
    },
  },
  async run() {
    const { resources } = await this.app.getContacts();

    resources.filter((contact) => contact.record_type === "person")
      .forEach(this.emitEvent);
  },
};
