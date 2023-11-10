import passcreator from "../../passcreator.app.mjs";

export default {
  props: {
    passcreator,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      await this.passcreator.createSubscription({
        data: {
          subscription_url: this.http.endpoint,
          target_url: this.http.endpoint,
          event: this.getEvent(),
        },
      });
    },
    async deactivate() {
      await this.passcreator.deleteSubscription({
        data: {
          subscription_url: this.http.endpoint,
          target_url: this.http.endpoint,
        },
      });
    },
  },
  methods: {
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
