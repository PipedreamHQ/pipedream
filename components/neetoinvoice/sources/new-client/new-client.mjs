import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "neetoinvoice-new-client",
  name: "New Client (Instant)",
  description: "Emit new event every time there is a new client in neetoInvoice. [See the documentation](https://help.neetoinvoice.com/articles/neetoinvoice-zapier-integration)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "new_client";
    },
    getFunction() {
      return this.neetoinvoice.listClients;
    },
    getDataToEmit(body) {
      return {
        id: body.id,
        summary: `A new client with Id: ${body.id} has been created!`,
        ts: new Date(body.createdAt),
      };
    },
  },
  sampleEmit,
};
