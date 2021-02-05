const procore = require("../../procore.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New or Updated Submittal (Instant)",
  key: "procore-submittal",
  description:
    "Emits an event each time a Submittal is created, updated, or deleted in a project.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getResourceName() {
      return "Submittals";
    },
    async getDataToEmit(body) {
      const { resource_id: resourceId } = body;
      const resource = await this.procore.getSubmittal(
        this.company,
        this.project,
        resourceId
      );
      return { body, resource };
    },
    getMeta({ body, resource }) {
      const { title, id: submittalId } = resource;
      const { id, event_type: eventType, timestamp } = body;
      const summary = title
        ? `${eventType} ${title}`
        : `${eventType} Submittal ID:${submittalId}`;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
};