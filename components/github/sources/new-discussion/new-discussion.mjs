import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "github-new-discussion",
  name: "New Discussion (Instant)",
  description: "Emit new events on new discussion to a repository",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "discussion",
      ];
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: data.title,
        ts: Date.parse(data.created_at),
      };
    },
  },
  async run(event) {
    const { body } = event;

    // skip initial response from Github
    if (body?.zen) {
      console.log(body.zen);
      return;
    }

    const meta = this.generateMeta(body.discussion);
    this.$emit(body.discussion, meta);
  },
};
