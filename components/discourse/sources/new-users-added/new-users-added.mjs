import common from "../../common.mjs";

export default {
  name: "New Users (Instant)",
  key: "discourse-new-users-added",
  version: "0.2.2",
  type: "source",
  description: "Emit new event every time a new user is created on your instance",
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      const users = await this.discourse.listUsers();
      for (const user of users.slice(0, 10)) {
        this.$emit(user, this.generateMeta(user));
      }
    },
    async activate() {
      await this.activate({
        web_hook_event_type_ids: [
          "3",
        ], // https://github.com/discourse/discourse/blob/master/app/models/web_hook_event_type.rb#L6
      });
    },
  },
  methods: {
    ...common.methods,
    generateMeta(user) {
      const {
        id,
        name: summary,
        created_at: createdAt,
      } = user;
      return {
        id,
        summary,
        ts: +new Date(createdAt),
      };
    },
  },
  async run(event) {
    this.validateEventAndEmit(event, "user_created", "user");
  },
};
