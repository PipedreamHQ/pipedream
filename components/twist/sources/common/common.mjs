import twist from "../../twist.app.mjs";

export default {
  dedupe: "unique",
  props: {
    twist,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspace: {
      propDefinition: [
        twist,
        "workspace",
      ],
    },
  },
  methods: {
    getHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    getHookActivationData() {
      throw new Error("getHookActivationData is not implemented");
    },
    getMeta() {
      throw new Error("getMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getHistoricalEvents();
      if (!events || events.length === 0) {
        return;
      }
      for (const event of events.slice(0, 10)) {
        const meta = await this.getMeta(event);
        this.$emit(event, meta);
      }
    },
    async activate() {
      const data = this.getHookActivationData();
      await this.twist.createHook(data);
    },
    async deactivate() {
      await this.twist.deleteHook(this.http.endpoint);
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) return;

    this.http.respond({
      status: 200,
    });

    const meta = this.getMeta(body);

    this.$emit(body, meta);
  },
};
