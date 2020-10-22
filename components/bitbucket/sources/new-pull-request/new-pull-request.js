const common = require("../../common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Pull Request (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-pull-request",
  description: "Emits an event when a new pull request is created.",
  version: "0.0.2",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repositoryId",
        c => ({ workspaceId: c.workspaceId }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventSourceName() {
      return EVENT_SOURCE_NAME;
    },
    getHookEvents() {
      return [
        "pullrequest:created",
      ];
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    generateMeta(data) {
      const { headers, body } = data;
      const { id, title } = body.pullrequest;
      const summary = `New Pull Request: ${title}`;
      const ts = +new Date(headers["x-event-time"]);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
