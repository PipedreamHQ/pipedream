import common from "../common/common-business.mjs";

const {
  props: {
    app, ...props
  },
} = common;

export default {
  ...common,
  key: "highlevel_oauth-update-business",
  name: "Update Business",
  description: "Updates an existing business in HighLevel. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/businesses/update-business)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
    ...props,
  },
  async run({ $ }) {
    const {
      app,
      businessId,
      ...data
    } = this.getData(false);
    const response = await app.updateBusiness({
      $,
      businessId,
      data,
    });

    $.export("$summary", `Successfully updated business (ID: ${businessId})`);
    return response;
  },
};
