import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "teach_n_go-new-student",
  name: "New Student Registration",
  description: "Emit new event when a new student is registered.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listStudents;
    },
    getSummary({
      fname, lname, email_address: email,
    }) {
      return `New Student: ${fname} ${lname}${email
        ? ` - ${email}`
        : ""}`;
    },
  },
  sampleEmit,
};
