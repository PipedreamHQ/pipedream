const isEmpty = require("lodash/isEmpty");
const common = require("../../common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Pipeline Event (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  key: "bitbucket-new-pipeline-event",
  description: "Emits an event when a pipeline event occurs.",
  version: "0.0.1",
  props: {
    ...common.props,
    repositoryId: {
      optional: true,
      propDefinition: [
        bitbucket,
        "repositoryId",
        c => ({ workspaceId: c.workspaceId }),
      ],
    },
    eventTypes: {
      type: "string[]",
      label: "Pipeline Event Types",
      description: "The type of pipeline events that will trigger this event source",
      optional: true,
      options: [
        // See https://support.atlassian.com/bitbucket-cloud/docs/event-payloads/
        { label: 'Build started', value: 'INPROGRESS' },
        { label: 'Build succeeded', value: 'SUCCESSFUL' },
        { label: 'Build failed', value: 'FAILED' },
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
        'repo:commit_status_created',
        'repo:commit_status_updated',
      ];
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    isEventRelevant(event) {
      const { state: eventType } = event.body.commit_status;
      return (
        isEmpty(this.eventTypes) ||
        this.eventTypes.some(i => i === eventType)
      );
    },
    generateMeta(data) {
      const {
        "x-request-uuid": id,
        "x-event-time": eventDate,
      } = data.headers;
      const {
        repository,
        state: eventType,
      } = data.body.commit_status;
      const summary = `New pipeline event in ${repository.name}: ${eventType}`;
      const ts = +new Date(eventDate);
      return {
        id,
        summary,
        ts,
      };
    },
    processEvent(event) {
      if (this.isEventRelevant(event)) {
        const parent = common.methods.processEvent.bind(this);
        return parent(event);
      }
    },
  },
};
