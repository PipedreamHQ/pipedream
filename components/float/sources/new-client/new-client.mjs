import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "float-new-client",
  name: "New Client",
  description: "Emit new event when a new client is created. [See the documentation](https://developer.float.com/api_reference.html#!/Clients/getClients)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "client_id";
    },
    getFunction() {
      return this.float.listClients;
    },
    getSummary(item) {
      return `New Client Created: ${item.name} (${item.client_id})`;
    },
  },
  sampleEmit,
};
