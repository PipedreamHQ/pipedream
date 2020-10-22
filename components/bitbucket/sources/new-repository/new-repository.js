const common = require("../../common");
const watchWorkspace = require("../new-workspace-event/new-workspace-event");

const EVENT_SOURCE_NAME = "New Repository (Instant)";

module.exports = {
  ...watchWorkspace,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-repository",
  description: "Emits an event when a repository is created.",
  version: "0.0.1",
  props: {
    ...common.props,
  },
  methods: {
    ...watchWorkspace.methods,
    getEventSourceName() {
      return EVENT_SOURCE_NAME;
    },
    getHookEvents() {
      return [
        "repo:created",
      ];
    },
    generateMeta(data) {
      const { headers, body } = data;
      const {
        "x-request-uuid": id,
        "x-event-time": eventDate,
      } = headers;
      const {
        full_name: repositoryName,
      } = body.repository;
      const summary = `New repository created: ${repositoryName}`;
      const ts = +new Date(eventDate);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
