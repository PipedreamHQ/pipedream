import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "knorish-new-signup",
  name: "New Signup",
  description: "Emit new event when a new signup or registration happens on your site. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.knorish.listUsers;
    },
    getSummary(item) {
      return `A new signup with id: "${item.id}" was created!`;
    },
  },
  sampleEmit,
};
