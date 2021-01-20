const procore = require("../../procore.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New or Updated RFI (Instant)",
  key: "procore-new-or-updated-rfi",
  description: "Emits an event each time a RFI is created, updated, or deleted in a project.",
  version: "0.0.1",
  methods: {
    getEventTypes() {
      return ["create", "update", "delete"];
    },
    getResourceName() {
      return "RFIs";
    },
    async getDataToEmit(body) {
      const { resource_id } = body;
      const resource = await this.procore.getRFI(this.company, this.project, resource_id);
      return { body, resource };
    },
    getMeta({ body, resource }) {
      const { subject } = resource;
      const { id, event_type } = body;
      return {
        id,
        summary: `${event_type} ${subject}`,
        ts: Date.now(),
      }
    }
  },
};
