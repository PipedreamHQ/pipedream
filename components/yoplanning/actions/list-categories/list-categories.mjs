import common from "../common/list.mjs";

export default {
  ...common,
  key: "yoplanning-list-categories",
  name: "List Categories",
  description: "Lists all categories. [See the documentation](https://yoplanning.pro/api/v3.1/swagger/)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  methods: {
    ...common.methods,
    listCategories(args = {}) {
      return this.app.makeRequest({
        path: "/categories/",
        ...args,
      });
    },
    getResourceFn() {
      return this.listCategories;
    },
    getResourceFnArgs(step) {
      return {
        step,
      };
    },
    getSummaryArgs(count) {
      return [
        count,
        "category",
        "categories",
      ];
    },
  },
};
