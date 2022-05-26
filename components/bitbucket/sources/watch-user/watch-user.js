const common = require("../../common");
const { bitbucket } = common.props;

module.exports = {
  ...common,
  name: "New User Watcher",
  key: "bitbucket-watch-user",
  description: "Emit new event that occurs from any repository belonging to the user.",
  type: "source",
  version: "0.0.1",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repositoryId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    eventTypes: {
      propDefinition: [
        bitbucket,
        "eventTypes",
        () => ({
          subjectType: "repository",
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventSourceName() {
      return "New User Watcher";
    },
    getHookEvents() {
      return this.eventTypes;
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    generateMeta(data) {
      const {
        "x-request-uuid": id,
        "x-event-key": eventType,
        "x-event-time": eventDate,
      } = data.headers;
      const summary = `New repository event: ${eventType}`;
      const ts = +new Date(eventDate);
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const data = {
        headers: event.headers,
        body: event.body,
      };
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
  },
};
