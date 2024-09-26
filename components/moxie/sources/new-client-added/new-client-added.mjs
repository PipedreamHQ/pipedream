import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "moxie-new-client-added",
  name: "New Client Added",
  version: "0.0.1",
  description: "Emit new event when a new client is created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResources() {
      return this.moxie.listClients();
    },
    getTsKey() {
      return "created";
    },
    generateMeta(client) {
      return {
        id: client.id,
        summary: client.name,
        ts: Date.parse(client[this.getTsKey()]),
      };
    },
  },
  sampleEmit,
};
