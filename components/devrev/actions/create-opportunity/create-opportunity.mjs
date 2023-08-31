import common from "../common/common-work-object.mjs";

export default {
  ...common,
  key: "devrev-create-opportunity",
  name: "Create Opportunity",
  description: "Creates a new opportunity in DevRev. [See the documentation](https://devrev.ai/docs/apis/beta-api-spec#/operations/works-create)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    accountId: {
      propDefinition: [
        common.props.devrev,
        "accountId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "opportunity";
    },
  },
};
