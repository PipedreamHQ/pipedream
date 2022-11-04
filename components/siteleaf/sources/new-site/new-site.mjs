import base from "../common/base.mjs";

export default {
  ...base,
  key: "siteleaf-new-site",
  type: "source",
  name: "New Site",
  description: "Emit new event when a new site is created",
  version: "0.0.1",
  methods: {
    ...base.methods,
    async fetchEvents() {
      let page = 1;
      const emittedEvents = this.getEmittedEvents();
      while (true) {
        const data = await this.app.listSites(
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
