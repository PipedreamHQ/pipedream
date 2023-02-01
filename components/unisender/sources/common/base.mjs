import unisender from "../../unisender.app.mjs";

export default {
  ...unisender,
  props: {
    unisender,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    ...unisender.methods,
    processEvent(body) {
      const meta = this.getMeta(body);
      this.$emit(body, meta);
    },
  },
  hooks: {
    async activate() {
      await this.unisender.setHook({
        params: {
          hook_url: this.http.endpoint,
          event_format: "json_post",
          [`events[${this.getEvent()}]`]: "*",
          single_event: 1,
          status: "active",
        },
      });

      console.log(`Webhook successful created. (Endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      await this.unisender.removeHook({
        params: {
          hook_url: this.http.endpoint,
        },
      });
    },
  },
  async run(event) {
    const { body } = event;

    const response = {
      status: 200,
    };
    this.http.respond(response);

    return body && this.processEvent(body);
  },
};
