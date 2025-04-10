import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lucca-new-user",
  name: "New User Created",
  description: "Emit new event when a new user (employee) is created in Lucca. [See the documentation](https://developers.lucca.fr/api-reference/legacy/directory/list-users)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listUsers;
    },
    getSummary(item) {
      return `New User: ${item.name}`;
    },
  },
  sampleEmit,
};
