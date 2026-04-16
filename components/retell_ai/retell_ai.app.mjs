import Retell from "retell-sdk";

export default {
  type: "app",
  app: "retell_ai",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of the agent",
      async options() {
        const agents = await this.listAgents();
        return agents.map((agent) => ({
          label: agent.agent_name,
          value: agent.agent_id,
        }));
      },
    },
  },
  methods: {
    client() {
      return new Retell({
        apiKey: this.$auth.api_key,
      });
    },
    listAgents() {
      return this.client().agent.list();
    },
    updateAgent({
      agentId, data,
    }) {
      return this.client().agent.update(agentId, data);
    },
  },
};
