import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "talenthr-new-employee",
  name: "New Employee Created",
  description: "Emit new event whenever a new employee is created. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.talenthr.listEmployees;
    },
    getSummary({
      first_name: fName, last_name: lName, email,
    }) {
      return `New Employee: ${fName} ${lName} (${email})`;
    },
    sortData(data) {
      return data.sort((a, b) => b.id - a.id);
    },
  },
  sampleEmit,
};
