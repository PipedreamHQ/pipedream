import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import rejoiner from "../../rejoiner.app.mjs";

export default {
  key: "rejoiner-new-contact-in-list",
  name: "New Contact in List",
  description: "Emit new event when a contact is added to the specified list. [See the documentation](https://docs.rejoiner.com/reference/retrieve-list-contacts).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rejoiner,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    listId: {
      propDefinition: [
        rejoiner,
        "listId",
      ],
    },
  },
  methods: {
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: contact.email,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const results = this.rejoiner.paginate({
      fn: this.rejoiner.listListContacts,
      args: {
        listId: this.listId,
      },
    });

    for await (const item of results) {
      const contact = item.customer;
      const meta = this.generateMeta(contact);
      this.$emit(item, meta);
    }
  },
};
