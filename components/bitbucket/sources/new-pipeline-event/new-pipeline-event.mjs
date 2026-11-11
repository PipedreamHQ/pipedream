import common from "../common/common.mjs";
import _ from "lodash";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Pipeline Event (Instant)",
  key: "bitbucket-new-pipeline-event",
  description: "Emit new event when a pipeline event occurs. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.6",
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
      type: "string[]",
    },
    eventTypes: {
      type: "string[]",
      label: "Pipeline Event Types",
      description: "The type of pipeline events that will trigger this event source",
      optional: true,
      options: [
        {
          label: "Build started",
          value: "INPROGRESS",
        },
        {
          label: "Build succeeded",
          value: "SUCCESSFUL",
        },
        {
          label: "Build failed",
          value: "FAILED",
        },
      ],
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return this.repositoryId.length === 1
        ? `repositories/${this.workspaceId}/${this.repositoryId[0]}/hooks`
        : this.repositoryId.map((repo) => `repositories/${this.workspaceId}/${repo}/hooks`);
    },
    getWebhookEventTypes() {
      return [
        "repo:commit_status_created",
        "repo:commit_status_updated",
      ];
    },
    isEventRelevant(eventType) {
      return _.isEmpty(this.eventTypes) || this.eventTypes.some((et) => et === eventType);
    },
    proccessEvent(event) {
      const {
        "x-request-uuid": id,
        "x-event-time": eventDate,
      } = event.headers;

      const {
        repository,
        commit_status: { state: eventType },
      } = event.body;

      if (!this.isEventRelevant(eventType)) return;

      this.$emit(event.body, {
        id: id,
        summary: `New pipeline event in ${repository.name}: ${eventType}`,
        ts: Date.parse(eventDate),
      });
    },
  },
};
