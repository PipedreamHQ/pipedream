import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Review Request (Instant)",
  key: "bitbucket-new-review-request",
  description: "Emit new event when a reviewer is added to a pull request.",
  version: "0.0.2",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repository",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return `workspaces/${this.workspaceId}/${this.repositoryId}/hooks`;
    },
    getWebhookEventTypes() {
      return [
        "pullrequest:created",
        "pullrequest:updated",
      ];
    },
    proccessEvent(event) {
      const {
        pullrequest,
        pullrequest: { reviewers },
      } = event.body;

      reviewers.forEach((reviewer) => {
        this.$emit(reviewer, {
          id: `${pullrequest.id}-${reviewer.display_name}`,
          summary: `New reviewer ${reviewer.display_name} added in ${pullrequest.title}`,
          ts: Date.parse(event.headers["x-event-time"]),
        });
      });
    },
  },
};
