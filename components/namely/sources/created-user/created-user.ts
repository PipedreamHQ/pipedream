import { defineSource } from "@pipedream/types";
import base from "../common/base-user";

export default defineSource({
  ...base,
  key: "namely-created-user",
  version: "0.0.1",
  name: "New Created User",
  description: "Emit new event for each user created.",
  type: "source",
  dedupe: "unique",
  methods: {
    async emitEvent(user) {
      this.$emit(user, {
        id: user.id,
        summary: `New user created with id ${user.id}`,
        ts: Date.parse(user.created_at),
      });
    },
  },
});
