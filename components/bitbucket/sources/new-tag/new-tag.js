const common = require("../../common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Tag (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-tag",
  description: "Emits an event when a commit is tagged.",
  version: "0.0.1",
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
    isNewTag(change) {
      const expectedChangeTypes = new Set([
        "tag",
      ]);
      return (
        change.created &&
        expectedChangeTypes.has(change.new.type)
      );
    },
    generateMeta(data) {
      const { headers, change } = data;
      const { name: newTagName } = change.new;
      const summary = `New Tag: ${newTagName}`;
      const ts = +new Date(headers["x-event-time"]);
      const compositeId = `${newTagName}-${ts}`;
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
        .filter(this.isNewTag)
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
