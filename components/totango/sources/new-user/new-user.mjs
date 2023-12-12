import common from "../common/common.mjs";

export default {
  ...common,
  name: "New User",
  version: "0.0.3",
  key: "totango-new-user",
  description: "Emit new event for each created user. [See the docs](https://support.totango.com/hc/en-us/articles/204174135-Search-API-accounts-and-users-)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New user with id ${data.id}`,
        ts: data[this.getTimestampKey()],
      });
    },
    getResourceMethod() {
      return this.totango.searchUsers;
    },
    getTerms(lastCreated = 0) {
      return `{ "type":"date", "term" : "first_activity_time", "gte" : ${lastCreated}}`;
    },
    getTimestampKey() {
      return "first_activity_time";
    },
  },
};
