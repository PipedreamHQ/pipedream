import common from "../common/common-work-object.mjs";

export default {
  ...common,
  key: "devrev-create-issue",
  name: "Create Issue",
  description: "Creates a new issue in DevRev. [See the documentation](https://devrev.ai/docs/apis/beta-api-spec#/operations/works-create)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    reportedBy: {
      propDefinition: [
        common.props.devrev,
        "userIds",
      ],
      label: "Reported By",
      description: "The users that reported the work",
      optional: true,
    },
    priority: {
      propDefinition: [
        common.props.devrev,
        "priority",
      ],
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "issue";
    },
  },
};
