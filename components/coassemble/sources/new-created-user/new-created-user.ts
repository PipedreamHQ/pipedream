import { defineSource } from "@pipedream/types";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "coassemble-new-created-user",
  name: "New Created User",
  description: "Emit new event when a new user is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.coassemble.listUsers;
    },
    getSummary({ id }): string {
      return `A new user with id ${id} was created!`;
    },
  },
});
