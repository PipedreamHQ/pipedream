import app from "../../you_need_a_budget.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    budgetId: {
      propDefinition: [
        app,
        "budgetId",
      ],
    },
  },
  methods: {
    getLastKnowledgeOfServer() {
      return this.db.get("lastKnowledgeOfServer");
    },
    setLastKnowledgeOfServer(lastKnowledgeOfServer) {
      this.db.set("lastKnowledgeOfServer", lastKnowledgeOfServer);
    },
    getEmittedTransactions() {
      return this.db.get("emittedTransactions") ?? {};
    },
    setEmittedTransactions(emittedTransactions) {
      return this.db.set("emittedTransactions", emittedTransactions);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getThisMonth() {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      return `${year}/${month}`;
    },
  },
};
