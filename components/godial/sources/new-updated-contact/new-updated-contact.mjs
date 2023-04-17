import godial from "../../app/godial.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Updated Contact",
  version: "0.0.3",
  key: "godial-new-updated-contact",
  description: "Emit new event on a contact is updated.",
  type: "source",
  dedupe: "unique",
  props: {
    godial,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    listId: {
      propDefinition: [
        godial,
        "listId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      if (!data.modifiedOn) {
        return;
      }

      this.$emit(data, {
        id: `${data.id} - ${data.modifiedOn}`,
        summary: `New contact updated with ID ${data.id}`,
        ts: Date.parse(data.modifiedOn),
      });
    },
  },
  async run() {
    const contacts = await this.godial.getContacts({
      listId: this.listId,
    });

    contacts.reverse().forEach(this.emitEvent);
  },
};
