import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Incident Created (Instant)",
  version: "0.0.3",
  key: "statuspage-new-incident-created",
  description: "Emit new event on each created incident.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async deploy() {
      const incidents = await this.statuspage.getIncidents({
        pageId: this.pageId,
        params: {
          limit: 20,
        },
      });

      incidents.reverse().forEach(this.emitEvent);
    },
    emitEvent(event) {
      const data = event?.incident ?? event;

      this.$emit(data, {
        id: data.id,
        summary: `New incident created with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
  },
};
