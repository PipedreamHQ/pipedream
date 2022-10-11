import productboard from "../../productboard.app.mjs";

export default {
  key: "productboard-new-note",
  name: "New Note",
  description: "Emit new event when a note is added",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    productboard,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      await this.productboard.createHook({
        data: {
          name: "Pipedream - New Note",
          events: [],
        },
      });
    },
  },
  async run() {

  },
};
