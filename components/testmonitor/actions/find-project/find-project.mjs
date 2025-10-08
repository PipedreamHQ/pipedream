import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-find-project",
  name: "Find a Project",
  description: "Retrieve a list of projects. [See the docs here](https://docs.testmonitor.com/#tag/Projects/operation/GetProjectCollection)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    withProp: {
      propDefinition: [
        common.props.testmonitor,
        "with",
      ],
      options: constants.PROJECT_OPTIONS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.testmonitor.getProjects;
    },
    getSummary() {
      return "Projects successfully fetched!";
    },
  },
};
