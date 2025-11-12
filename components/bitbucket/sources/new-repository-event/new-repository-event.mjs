import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Repository Event (Instant)",
  key: "bitbucket-new-repository-event",
  description: "Emit new event when a repository-wide event occurs. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.3",
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
      return `repositories/${this.workspaceId}/${this.repositoryId}/hooks`;
    },
    getWebhookEventTypes() {
      return this.eventTypes;
    },
    proccessEvent(event) {
      const {
        headers,
        body,
      } = event;

      body.eventType = headers["x-event-key"];

      this.$emit(body, {
        id: headers["x-request-uuid"],
        summary: `New repository event ${headers["x-event-key"]}`,
        ts: Date.parse(headers["x-event-time"]),
      });
    },
  },
};
