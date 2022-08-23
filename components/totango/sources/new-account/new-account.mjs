import totango from "../../totango.app.mjs";

export default {
  name: "New Account",
  version: "0.0.1",
  key: "totango-new-account",
  description: "Emit new event for each created account",
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
        id: data.name,
        summary: `New account with name ${data.name}`,
        ts: new Date(),
      });
    },
  },
  hooks: {
    async deploy() {
      const accounts = await this.totango.searchAccounts({
        data: {
          "query": "{\"terms\":[],\"count\":10,\"offset\":0,\"fields\":[],\"scope\":\"all\"}",
        },
      });

      accounts.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const accounts = await this.totango.searchAccounts({
        data: {
          "query": `{"terms":[],"count":1000,"offset":${page * 100},"fields":[],"scope":"all"}`,
        },
      });

      accounts.reverse().forEach(this.emitEvent);

      if (accounts.length < 1000) {
        return;
      }

      page++;
    }
  },
};
