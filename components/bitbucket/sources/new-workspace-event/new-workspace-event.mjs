import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Workspace Event (Instant)",
  key: "bitbucket-new-workspace-event",
  description: "Emit new event when a workspace-wide event occurs. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-workspaces/#api-workspaces-workspace-hooks-post)",
  version: "0.0.5",
  props: {
    ...common.props,
    eventTypes: {
      propDefinition: [
        bitbucket,
        "eventTypes",
        () => ({
          subjectType: "workspace",
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
