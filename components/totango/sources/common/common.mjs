import totango from "../../totango.app.mjs";

export default {
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
      throw new Error("emitEvent is not implemented", data);
    },
    getResourceMethod() {
      throw new Error("getResourceMethod is not implemented");
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.getResourceMethod()({
        data: {
          "query": "{\"terms\":[],\"count\":10,\"offset\":0,\"fields\":[],\"scope\":\"all\"}",
        },
      });

      resources.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const resources = await this.getResourceMethod()({
        data: {
          "query": `{"terms":[],"count":1000,"offset":${page * 100},"fields":[],"scope":"all"}`,
        },
      });

      resources.reverse().forEach(this.emitEvent);

      if (resources.length < 1000) {
        return;
      }

      page++;
    }
  },
};
