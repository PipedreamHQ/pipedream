import base from "../common/base.mjs";
import app from "../../siteleaf.app.mjs";

export default {
  ...base,
  key: "siteleaf-new-page",
  type: "source",
  name: "New Page",
  description: "Emit new event when a new page is created",
  version: "0.0.1",
  props: {
    ...base.props,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
  },
  methods: {
    ...base.methods,
    async fetchEvents() {
      let page = 1;
      const emittedEvents = this.getEmittedEvents();
      while (true) {
        const data = await this.app.listPages(
          this.siteId,
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
              summary: item.basename,
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
