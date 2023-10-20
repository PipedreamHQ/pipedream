import { defineSource } from "@pipedream/types";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "salesmate-new-created-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.salesmate.listContacts;
    },
    getSummary({ id }): string {
      return `A new contact with id ${id} was created!`;
    },
  },
});
