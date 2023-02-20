import { defineSource } from "@pipedream/types";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "coassemble-new-created-enrolment",
  name: "New Created Enrolment",
  description: "Emit new event when a new course enrolment is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.coassemble.listEnrolments;
    },
    getSummary({ id }): string {
      return `A new enrolment with id ${id} was created!`;
    },
  },
});
