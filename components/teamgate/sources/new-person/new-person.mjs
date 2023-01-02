import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Person",
  key: "teamgate-new-person",
  description: "Emit new event when a new person is created. [See docs here](https://developers.teamgate.com/#7eb019a9-9168-4056-a507-75bd32c105e0)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(name, id) {
      return `New person created: ${name} (${id})`;
    },
    getFunc() {
      return this.teamgate.listPeople;
    },
  },
};
