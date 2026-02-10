import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-delete-business",
  name: "Delete Business",
  description: "Deletes a business in HighLevel. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/businesses/delete-business)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: false,
    readOnlyHint: false,
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
    const response = await this.app.deleteBusiness({
      $,
      businessId: this.businessId,
    });

    $.export("$summary", `Successfully deleted business (ID: ${this.businessId})`);
    return response;
  },
};
