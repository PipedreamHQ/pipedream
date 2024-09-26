import common from "../common/common.mjs";

export default {
  ...common,
  name: "Incident Updated (Instant)",
  version: "0.0.3",
  key: "statuspage-incident-updated",
  description: "Emit new event on each updated incident.",
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

      if (data.incident_updates.length <= 1) {
        return;
      }

      this.$emit(data, {
        id: `${data.id}-${Date.parse(data.updated_at)}`,
        summary: `New incident updated with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
  },
};
