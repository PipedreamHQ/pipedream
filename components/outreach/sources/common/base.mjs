import outreach from "../../outreach.app.mjs";

export default {
  props: {
    outreach,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    emitEvent(body) {
      this.$emit(body, {
        id: body.meta.jobId,
        summary: `New ${body.meta.eventName.split(".").join(" ")} with Id: ${body.data.id}`,
        ts: body.meta.deliveredAt,
      });
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.outreach.createHook({
        data: {
          data: {
            attributes: {
              action: "*",
              active: true,
              resource: this.getResource(),
              url: this.http.endpoint,
            },
            type: "webhook",
          },
        },
      });
      this.setHookId(data.id);
    },
    async deactivate() {
      const hookId = this.getHookId();
      await this.outreach.deleteHook(hookId);
    },
  },
  async run(event) {
    const { body } = event;

    this.http.respond({
      status: 200,
    });

    this.emitEvent(body);
  },
};
