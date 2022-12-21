import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Contact Group",
  key: "mixmax-new-contact-group",
  description: "Emit new event when a new contact group is created. [See docs here](https://developer.mixmax.com/reference/contactgroups)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary({
      name, _id,
    }) {
      return `New contact group created: ${name} (${_id})`;
    },
    getFunc() {
      return this.mixmax.listGroups;
    },
  },
};
