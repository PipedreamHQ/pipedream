import common from "../common/common.mjs";

export default {
  ...common,
  name: "New User",
  version: "0.0.1",
  key: "totango-new-user",
  description: "Emit new event for each created user",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New user with id ${data.id}`,
        ts: new Date(),
      });
    },
    getResourceMethod() {
      return this.totango.searchUsers;
    },
  },
};
