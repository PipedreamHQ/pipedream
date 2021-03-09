const common = require("../../common");
const isEmpty = require("lodash.isempty");

module.exports = {
  name: "New Users",
  version: "0.0.1",
  description:
    "Emits an event every time a new user is created on your instance",
  ...common,
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        web_hook_event_type_ids: ["3"], // https://github.com/discourse/discourse/blob/master/app/models/web_hook_event_type.rb#L6
      });
    },
  },
  methods: {
    ...common.methods,
    generateMeta(user) {
      const { id, name: summary, created_at } = user;
      return {
        id,
        summary,
        ts: +new Date(created_at),
      };
    },
  },
  async run(event) {
    const { body, headers, method } = event;

    // TEST EVENTS
    if (method === "GET" && !this.isComponentInitialized()) {
      console.log("First time running event source - emitting test topics");
      const users = await this.discourse.listUsers();
      for (const user of users.slice(0, 10)) {
        this.$emit(user, this.generateMeta(user));
      }
      this.markComponentAsInitialized();
      return;
    }

    if (isEmpty(headers) || !event.headers["x-discourse-event-signature"]) {
      console.log("Discourse signature header not present. Exiting");
      return;
    }

    this.verifySignature(
      event.headers["x-discourse-event-signature"],
      event.body
    );

    const eventName = "user_created";
    if (headers["x-discourse-event"] !== eventName) {
      console.log(`Not a ${eventName} event. Exiting`);
      return;
    }

    const { user } = body;
    this.$emit(user, this.generateMeta(user));
  },
};
