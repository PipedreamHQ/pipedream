import helpspace from "../../helpspace.app.mjs";

export default {
  props: {
    helpspace,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      await this.helpspace.updateWebhook({
        data: {
          webhooks: {
            enabled: true,
            url: this.http.endpoint,
            trigger: this.getTrigger(),
          },
        },
      });
    },
  },
  methods: {
    getBaseTrigger() {
      return {
        ticket: {
          created: false,
          assigned: false,
          deleted: false,
          status_updated: false,
          channel_updated: false,
          tags_updated: false,
          customer_message_created: false,
          agent_message_created: false,
          note_created: false,
        },
        customer: {
          created: false,
          updated: false,
          deleted: false,
        },
        tag: {
          created: false,
          updated: false,
          deleted: false,
        },
      };
    },
    getTrigger() {
      throw new Error("getTrigger is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    const { data } = body;
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
