const procore = require("../procore.app.js");

module.exports = {
  dedupe: "unique",
  props: {
    procore,
    db: "$.service.db",
    http: "$.interface.http",
    company: {
      propDefinition: [
        procore,
        "company",
      ],
    },
    project: {
      propDefinition: [
        procore,
        "project",
        (c) => ({
          company: c.company,
        }),
      ],
    },
  },
  methods: {
    getComponentEventTypes() {
      return this.procore.getEventTypes();
    },
    getResourceName() {
      throw new Error("getResourceName is not implemented");
    },
  },
  hooks: {
    async activate() {
      const hook = await this.procore.createHook(
        this.http.endpoint,
        this.company,
        this.project,
      );
      this.db.set("hookId", hook.id);
      // create hook triggers
      const eventTypes = this.getComponentEventTypes();
      const resourceName = this.getResourceName();
      const triggerIds = [];
      for (const eventType of eventTypes) {
        const trigger = await this.procore.createHookTrigger(
          hook.id,
          this.company,
          this.project,
          resourceName,
          eventType,
        );
        triggerIds.push(trigger.id);
      }
      this.db.set("triggerIds", triggerIds);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const triggerIds = this.db.get("triggerIds");
      // delete hook triggers
      for (const triggerId of triggerIds) {
        await this.procore.deleteHookTrigger(
          hookId,
          triggerId,
          this.company,
          this.project,
        );
      }
      // delete hook
      await this.procore.deleteHook(hookId, this.company, this.project);
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    const dataToEmit = await this.getDataToEmit(body);
    const meta = this.getMeta(dataToEmit);

    this.$emit(dataToEmit, meta);
  },
};
