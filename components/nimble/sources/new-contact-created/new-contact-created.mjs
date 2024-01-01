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
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  async run() {
    const { resources } = await this.app.getContacts();

    resources.filter((contact) => contact.record_type === "person")
      .forEach(this.emitEvent);

    const lastResourceId = this._getLastResourceId();

    let page = 1;

    while (page >= 0) {
      let { resources } = await this.app.getContacts({
        params: {
          page,
          per_page: 100,
        },
      });

      resources = resources.filter((contact) => contact.record_type === "person");

      this._setLastResourceId(resources[0].id);

      resources.reverse().forEach(this.emitEvent);

      if (
        resources.length < 100 ||
        resources.find((resource) => resource.id === lastResourceId)
      ) {
        return;
      }

      page++;
    }
  },
};
