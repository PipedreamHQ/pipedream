import { defineSource } from "@pipedream/types";
import base from "../common/base-user";

export default defineSource({
  ...base,
  key: "namely-updated-user",
  version: "0.0.2",
  name: "New Updated User",
  type: "source",
  description: "Emit new event for each user updated.",
  dedupe: "unique",
  methods: {
    _generateEventUniqueId(user) {
      return `${user.id}-${user.updated_at}`;
    },
    async emitEvent(user) {
      this.$emit(user, {
        id: this._generateEventUniqueId(user),
        summary: `New user updated with id ${user.id}`,
        ts: Date.parse(user.created_at),
      });
    },
  },
});
