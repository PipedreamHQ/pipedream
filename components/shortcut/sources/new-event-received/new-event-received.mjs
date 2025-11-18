import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shortcut-new-event-received",
  name: "New Event Received (Instant)",
  description: "Emit new event when a new webhook event is received. [See the documentation](https://developer.shortcut.com/api/rest/v3#Create-Generic-Integration)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    issueType: {
      type: "string",
      label: "Issue Type",
      description: "Filter events by issue type. Defaults to both `story` and `epic`.",
      options: [
        "story",
        "epic",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter events by name. Will match any part of the name.",
      optional: true,
    },
    workflowStateIds: {
      propDefinition: [
        common.props.shortcut,
        "workflowStateId",
      ],
      type: "integer[]",
      label: "Workflow State IDs",
      description: "Filter events by workflow state IDs",
      optional: true,
    },
    labelIds: {
      propDefinition: [
        common.props.shortcut,
        "labelIds",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New ${body.actions[0].entity_type} event received`,
        ts: Date.parse(body.changed_at),
      };
    },
    async processEvent(body) {
      const type = body.actions[0].entity_type;
      if (this.issueType && this.issueType !== type) {
        return;
      }
      if (this.name && !body.actions[0].name?.toLowerCase().includes(this.name.toLowerCase())) {
        return;
      }

      const method = type === "story"
        ? "searchStories"
        : type === "epic"
          ? "searchEpics"
          : null;

      if (!method) {
        return;
      }

      const issue = (await this.shortcut.callWithRetry(method, {
        query: `id:${body.actions[0].id}`,
        page_size: 1,
      })).data.data[0];

      if (this.workflowStateIds && !this.workflowStateIds.includes(issue.workflow_state_id)) {
        return;
      }
      if (this.labelIds && !this.labelIds.includes(issue.label_ids)) {
        return;
      }

      const meta = this.generateMeta(body);
      this.$emit({
        body,
        issue,
      }, meta);
    },
  },
  sampleEmit,
};
