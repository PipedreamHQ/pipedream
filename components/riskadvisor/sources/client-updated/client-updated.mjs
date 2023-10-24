import common from "../common/base.mjs";

export default {
  ...common,
  key: "riskadvisor-client-updated",
  name: "Client Updated",
  description: "Emit new event each time a client is updated in RiskAdvisor. [See the documentation](https://api.riskadvisor.insure/clients#list-all-clients)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "updated_at";
    },
    getResourceFn() {
      return this.riskadvisor.listClients;
    },
    generateMeta(client) {
      const ts = Date.parse(client[this.getTsField()]);
      return {
        id: `${client.id}${ts}`,
        summary: `Client "${client.first_name} ${client.last_name}" Updated`,
        ts,
      };
    },
  },
};
