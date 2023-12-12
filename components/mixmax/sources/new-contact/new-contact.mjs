import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Contact",
  key: "mixmax-new-contact",
  description: "Emit new event when a new contact is created. [See docs here](https://developer.mixmax.com/reference/contacts)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary({
      email, _id,
    }) {
      return `New contact created: ${email} (${_id})`;
    },
    getFunc() {
      return this.mixmax.listContacts;
    },
  },
};
