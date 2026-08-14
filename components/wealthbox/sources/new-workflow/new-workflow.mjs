import common from "../common/common.mjs";

export default {
  ...common,
  key: "wealthbox-new-workflow",
  name: "New Workflow Enrollment",
  description: "Emit new event for each new workflow enrollment created in Wealthbox. Polls GET /workflows and tracks by `created_at`. Note: this triggers on workflow ENROLLMENT instances (a template applied to a record), not on new workflow templates. [See the documentation](http://dev.wealthbox.com/#workflows)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    resourceType: {
      type: "string",
      label: "Resource Type",
      description: "Optional. Restrict enrollments to a linked resource type (for example `Contact`).",
      optional: true,
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "Optional. Restrict enrollments to a specific linked resource id. Run **List Contact Options** to find contact ids.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getEvents({ params }) {
      const response = await this.wealthbox.listWorkflows({
        params: {
          ...params,
          resource_type: this.resourceType,
          resource_id: this.resourceId,
        },
      });
      return response?.workflows || [];
    },
    generateMeta(workflow) {
      return {
        id: workflow.id,
        summary: `New Workflow Enrollment: ${workflow.name || workflow.id}`,
        ts: this.getCreatedAtTs(workflow),
      };
    },
  },
  async run() {
    await this.processEvent(false);
  },
};
