import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  props: {
    surveyMonkey,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deactivate() {
      await this.surveyMonkey.deleteHook(this.getHookId());
    },
  },
  methods: {
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    this.$emit(event, {
      summary: this.getSummary(event),
      ts: Date.now(),
    });
  },
};
