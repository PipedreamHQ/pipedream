import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rocket_chat-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user is created in RocketChat.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(user) {
      return {
        id: user._id,
        summary: `New User: ${user.name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const users = this.rocketchat.paginate({
      resourceFn: this.rocketchat.listUsers,
      resourceType: "users",
    });

    for await (const user of users) {
      const meta = this.generateMeta(user);
      this.$emit(user, meta);
    }
  },
  sampleEmit,
};
