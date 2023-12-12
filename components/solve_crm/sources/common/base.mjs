import solveCrm from "../../solve_crm.app.mjs";

export default {
  props: {
    solveCrm,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      const items = await this.getHistoricalEvents(25);
      const { event } = this.getEventParams();
      for (const item of Object.values(items)) {
        if (typeof item !== "object") {
          continue;
        }
        const body = {
          content: {
            item,
          },
          objectid: item.id,
          occured: item.updated,
          type: event,
        };
        const meta = this.generateMeta(body);
        this.$emit(body, meta);
      }
    },
    async activate() {
      const eventParams = this.getEventParams();
      const data = {
        type: "web",
        url: this.http.endpoint,
        contenttype: "json",
        active: 1,
        ...eventParams,
      };
      const hook = await this.solveCrm.createHook({
        data,
      });
      this._setHookId(hook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.solveCrm.deleteHook(hookId);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    },
    formatDate(date) {
      return date.toISOString().split("T")[0];
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    isRelevant() {
      return true;
    },
  },
  async run(event) {
    const { body } = event;
    if (!this.isRelevant(body)) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
