import common from "../common/base.mjs";

export default {
  ...common,
  key: "riskadvisor-new-client-created",
  name: "New Client Created",
  description: "Emit new event each time a new client is created in RiskAdvisor. [See the documentation](https://api.riskadvisor.insure/clients#list-all-clients)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "created_at";
    },
    getResourceFn() {
      return this.riskadvisor.listClients;
    },
    generateMeta(client) {
      return {
        id: client.id,
        summary: `Client "${client.first_name} ${client.last_name}" Created`,
        ts: Date.parse(client[this.getTsField()]),
      };
    },
  },
};
