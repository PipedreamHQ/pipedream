import common from "../common/common-work-object.mjs";

export default {
  ...common,
  key: "devrev-create-issue",
  name: "Create Issue",
  description: "Creates a new issue in DevRev. [See the documentation](https://devrev.ai/docs/apis/beta-api-spec#/operations/works-create)",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getType() {
      return "issue";
    },
  },
};
