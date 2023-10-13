import app from "../../piggy.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Contact Created",
  version: "0.0.1",
  key: "piggy-new-contact-created",
  description: "Emit new event on each new contact.",
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
        id: data.uuid,
        summary: `New contact created with ID ${data.uuid}`,
        ts: new Date(),
      });
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  hooks: {
    async deploy() {
      const { data: contacts } = await this.app.getContacts({
        params: {
          limit: 20,
        },
      });

      contacts.forEach(this.emitEvent);
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 1;

    while (page >= 0) {
      const { data: contacts } = await this.app.getContacts({
        params: {
          page,
          limit: 100,
        },
      });

      if (contacts.length) {
        this._setLastResourceId(contacts[0].uuid);
      }

      contacts.forEach(this.emitEvent);

      if (
        contacts.length < 100 ||
        contacts.filter((contact) => contact.uuid === lastResourceId)
      ) {
        return;
      }

      page++;
    }
  },
};
