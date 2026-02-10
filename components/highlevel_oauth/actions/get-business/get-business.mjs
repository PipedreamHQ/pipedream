import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-get-business",
  name: "Get Business",
  description: "Retrieves a business by ID in HighLevel. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/businesses/get-business)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    businessId: {
      propDefinition: [
        common.props.app,
        "businessId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getBusiness({
      $,
      businessId: this.businessId,
    });

    $.export("$summary", `Successfully retrieved business (ID: ${this.businessId})`);
    return response;
  },
};
