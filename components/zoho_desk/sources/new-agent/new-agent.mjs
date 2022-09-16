import common from "../common.mjs";

export default {
  ...common,
  key: "zoho_desk-new-agent",
  name: "New Agent",
  description: "Emit new event when a new agent is created. [See the docs here](https://desk.zoho.com/DeskAPIDocument#Agents#Agents_Listagents)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.zohoDesk,
        "orgId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoDesk.getAgents;
    },
    getResourceFnArgs() {
      return {
        headers: {
          orgId: this.orgId,
        },
        params: {
          sortOrder: "desc", // asc | desc
        },
      };
    },
    resourceFilter() {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.now() > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.now(),
        summary: `Agent ID ${resource.id}`,
      };
    },
  },
};
