import app from "../../sifter.app.mjs";
import common from "../common.mjs";

export default {
  key: "sifter-new-issue",
  name: "New Issue Event",
  description: "Emit new events when a new issue is created. [See the docs here](https://sifterapp.com/developer/documentation/issues/#listing)",
  version: "0.0.1",
  type: "source",
  ...common,
  props: {
    app,
    ...common.props,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getIssues;
    },
    getResourceFnArgs() {
      return {
        projectId: this.projectId,
      };
    },
    getSummary(item) {
      return `New issue is created with number(${item.number}) and subject(${item.subject})`;
    },
    getResourceKey() {
      return "issues";
    },
    compareFn(item) {
      return new Date(item.created_at).getTime() > this.getLastFetchTime();
    },
    getDateKey() {
      return "created_at";
    },
  },
};
