const common = require("../../common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Review Request (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-review-request",
  description: "Emits an event when a reviewer is added to a pull request.",
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
        "pullrequest:created",
        "pullrequest:updated",
      ];
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    generateMeta(data) {
      const {
        headers,
        body,
        reviewer,
      } = data;
      const {
        id: pullRequestId,
        title,
      } = body.pullrequest;
      const {
        display_name: reviewerName,
        uuid: reviewerId,
      } = reviewer;
      const summary = `New reviewer for "${title}": ${reviewerName}`;
      const ts = +new Date(headers["x-event-time"]);
      const compositeId = `${pullRequestId}-${reviewerId}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const { headers, body } = event;
      body.pullrequest.reviewers.forEach(reviewer => {
        const data = {
          headers,
          body,
          reviewer,
        };
        const meta = this.generateMeta(data);
        this.$emit(data, meta);
      });
    },
  },
};
