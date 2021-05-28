const common = require("../../common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Branch (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-branch",
  description: "Emits an event when a new branch is created",
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
        "repo:push",
      ];
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    isNewBranch(change) {
      const expectedChangeTypes = new Set([
        "branch",
        "named_branch",
      ]);
      return (
        change.created &&
        expectedChangeTypes.has(change.new.type)
      );
    },
    generateMeta(data) {
      const { headers, change } = data;
      const newBranchName = change.new.name;
      const summary = `New Branch: ${newBranchName}`;
      const ts = +new Date(headers["x-event-time"]);
      const compositeId = `${newBranchName}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const { headers, body } = event;
      const { changes = [] } = body.push;
      changes
        .filter(this.isNewBranch)
        .forEach(change => {
          const data = {
            ...body,
            change,
          };
          const meta = this.generateMeta({
            headers,
            change,
          });
          this.$emit(data, meta);
        });
    },
  },
};
