import app from "../../siteleaf.app.mjs";

export default {
  key: "siteleaf-new-document",
  type: "source",
  name: "New Document",
  description: "Emit new event when a new document is created",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "How often to poll the Siteleaf API for new events",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    collectionPath: {
      propDefinition: [
        app,
        "collectionPath",
        ({ siteId }) => ({
          siteId,
        }),
      ],
    },
  },
  methods: {
    _setEmittedEvents(emittedEvents) {
      this.db.set("emittedEvents", emittedEvents);
    },
    _getEmittedEvents() {
      return this.db.get("emittedEvents") || {};
    },
    async fetchEvents() {
      let page = 1;
      const emittedEvents = this._getEmittedEvents();
      while (true) {
        const data = await this.app.listDocuments(
          this.siteId,
          this.collectionPath,
          page,
        );

        if (data.length === 0) {
          this._setEmittedEvents(emittedEvents);
          return;
        }

        for (const item of data) {
          if (!emittedEvents[item.id]) {
            this.$emit(item, {
              id: item.id,
              summary: item.title,
              ts: Date.now(),
            });
            emittedEvents[item.id] = 1;
          }
        }
        page++;
      }
    },
  },
  async run() {
    await this.fetchEvents();
  },
};
