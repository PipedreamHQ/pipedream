import totango from "../../totango.app.mjs";

export default {
  name: "New User",
  version: "0.0.1",
  key: "totango-new-user",
  description: "Emit new event for each created user",
  type: "source",
  dedupe: "unique",
  props: {
    totango,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New user with id ${data.id}`,
        ts: new Date(),
      });
    },
  },
  hooks: {
    async deploy() {
      const users = await this.totango.searchUsers({
        data: {
          "query": "{\"terms\":[],\"count\":10,\"offset\":0,\"fields\":[],\"scope\":\"all\"}",
        },
      });

      users.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const users = await this.totango.searchUsers({
        data: {
          "query": `{"terms":[],"count":1000,"offset":${page * 100},"fields":[],"scope":"all"}`,
        },
      });

      users.reverse().forEach(this.emitEvent);

      if (users.length < 1000) {
        return;
      }

      page++;
    }
  },
};
