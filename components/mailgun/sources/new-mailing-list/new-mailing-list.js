const {
  props,
  methods,
  ...common
} = require("../common-webhook");

module.exports = {
  ...common,
  key: "mailgun-new-mailing-list",
  name: "New Mailing List",
  type: "source",
  description: "Emit an event when a new mailing list is added to the associated Mailgun account.",
  version: "0.0.2",
  dedupe: "greatest",
  props: {
    ...props,
    timer: {
      propDefinition: [
        props.mailgun,
        "timer",
      ],
    },
  },
  methods: {
    ...methods,
    generateMeta(payload) {
      const ts = +new Date(payload.created_at);
      return {
        id: `${ts}`,
        summary: `New mailing list: ${payload.name}`,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const lists = await this.mailgun.api("lists").list({
        limit: 5,
      });
      for (let list of lists) {
        this.$emit(list, this.generateMeta(list));
      }
    },
  },
  async run() {
    const perPage = 100;
    for (let page = 0; ; page += perPage) {
      const lists = await this.mailgun.api("lists").list({
        skip: 0 * perPage,
        limit: perPage,
      });
      if (lists.length === 0) {
        return;
      }
      for (let list of lists) {
        this.$emit(list, this.generateMeta(list));
      }
    }
  },
};
