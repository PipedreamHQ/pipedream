import servicem8 from "../../servicem8.app.mjs";

export default {
  ...servicem8,
  props: {
    servicem8,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    ...servicem8.methods,
    processEvent(body) {
      const meta = this.getMeta(body);
      this.$emit(body, meta);
    },
  },
  hooks: {
    async activate() {
      const data = new URLSearchParams({
        callback_url: this.http.endpoint,
        ...this.getParams(),
      }).toString();
      await this.servicem8.setHook({
        $: this,
        data,
      });

      console.log(`Webhook successful created. (Endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      const { object } = this.getParams();
      await this.servicem8.removeHook({
        $: this,
        data: `object=${object}`,
      });
    },
  },
  async run(event) {
    const { body } = event;
    const response = {
      status: 200,
    };

    if (body.challenge) {
      response.body = body.challenge;
    }

    this.http.respond(response);
    return !body.challenge && await this.processEvent(body);
  },
};
