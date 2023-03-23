import common from "../common/common.mjs";

export default {
  ...common,
  key: "mailmodo-new-template-submitted",
  name: "New Template Submitted",
  description: "Emit new events when a new template is created. [See the docs](https://www.mailmodo.com/developers/shonrvhb4jw5u-templates/bb30da6d78f04-get-all-templates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getTemplates;
    },
    getSummary(item) {
      return `New template ${item.name} (ID: ${item.id})`;
    },
    getResourceKey() {
      return "templateDetails";
    },
  },
};
