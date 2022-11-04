import app from "../../siteleaf.app.mjs";
import base from "../common/base.mjs";

export default {
  ...base,
  key: "siteleaf-new-document",
  type: "source",
  name: "New Document",
  description: "Emit new event when a new document is created",
  version: "0.0.1",
  props: {
    ...base.props,
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
    ...base.methods,
    async fetchEvents() {
      let page = 1;
      const emittedEvents = this.getEmittedEvents();
      while (true) {
        const data = await this.app.listDocuments(
          this.siteId,
          this.collectionPath,
          page,
        );

        if (data.length === 0) {
          this.setEmittedEvents(emittedEvents);
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
};
