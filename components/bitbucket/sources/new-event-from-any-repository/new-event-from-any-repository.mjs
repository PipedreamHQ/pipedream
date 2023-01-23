import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Event from any Repository",
  key: "bitbucket-new-event-from-any-repository",
  description: "Emit new event when an event occurs from any repository belonging to the user. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.2",
  props: {
    ...common.props,
    repositoryIds: {
      propDefinition: [
        bitbucket,
        "multiRepositories",
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
    getPath() {
      return this.repositoryIds?.length > 1
        ? this.repositoryIds.map((repositoryId) => `repositories/${this.workspaceId}/${repositoryId}/hooks`)
        : `repositories/${this.workspaceId}/${this.repositoryIds[0]}/hooks`;
    },
    getWebhookEventTypes() {
      return this.eventTypes;
    },
    proccessEvent(event) {
      const {
        headers,
        body,
      } = event;

      this.$emit(body, {
        id: headers["x-request-uuid"],
        summary: `New repository event ${headers["x-event-key"]}`,
        ts: Date.parse(headers["x-event-time"]),
      });
    },
  },
};
