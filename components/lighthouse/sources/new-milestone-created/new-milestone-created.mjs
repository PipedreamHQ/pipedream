import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Milestone Created",
  version: "0.0.1",
  key: "lighthouse-new-milestone-created",
  description: "Emit new event for each new milestone created.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.lighthouse,
        "projectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent({ milestone }) {
      this.$emit(milestone, {
        id: milestone.id,
        summary: `New milestone created with ID ${milestone.id}`,
        ts: Date.parse(milestone.created_at),
      });
    },
    async getResources(args = {}) {
      const { milestones } = await this.lighthouse.getMilestones({
        ...args,
        projectId: this.projectId,
      });

      return milestones;
    },
    resourceKey() {
      return "milestone";
    },
  },
};
