import common from "../common/common.mjs";
import constants from "../common/constants.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Review Request (Instant)",
  key: "bitbucket-new-review-request",
  description: "Emit new event when a reviewer is added to a pull request.",
  version: "0.0.4",
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
      return `workspaces/${this.workspaceId}/hooks`;
    },
    getWebhookEventTypes() {
      return [
        "pullrequest:created",
        "pullrequest:updated",
      ];
    },
    async loadHistoricalData() {
      const activities = await this.bitbucket.getPullRequestActivities({
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
        params: {
          page: 1,
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      const event = [];
      activities.forEach((activity) => {
        for (const reviewer of activity.update.reviewers) {
          event.push({
            main: activity,
            sub: {
              id: `${activity.pull_request.id}-${reviewer.display_name}`,
              summary: `New reviewer ${reviewer.display_name} added in ${activity.pull_request.title}`,
              ts: activity.update.date,
            },
          });
        }
      });
      return event;
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
