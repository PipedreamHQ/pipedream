const common = require("../../common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Issue (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-issue",
  description: "Emits an event when a new issue is created",
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
        "issue:created",
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
      const { id, title } = body.issue;
      const summary = `New Issue: #${id} ${title}`;
      const ts = +new Date(headers["x-event-time"]);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
