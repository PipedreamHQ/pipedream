const common = require("../common.js");

module.exports = {
  ...common,
  name: "Submittal Event (Instant)",
  key: "procore-submittal",
  description:
    "Emits an event each time a Submittal is created, updated, or deleted in a project.",
  version: "0.0.2",
  type: "source",
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
        resourceId,
      );
      return {
        ...body,
        resource,
      };
    },
    getMeta({
      id, event_type, timestamp, resource,
    }) {
      const {
        title, id: submittalId,
      } = resource;
      const eventType = event_type;
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
