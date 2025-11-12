import common from "../common/common-work-object.mjs";

export default {
  ...common,
  key: "devrev-create-ticket",
  name: "Create Ticket",
  description: "Creates a new ticket in DevRev. [See the documentation](https://devrev.ai/docs/apis/beta-api-spec#/operations/works-create)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    revOrgId: {
      propDefinition: [
        common.props.devrev,
        "revOrgId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "ticket";
    },
  },
};
