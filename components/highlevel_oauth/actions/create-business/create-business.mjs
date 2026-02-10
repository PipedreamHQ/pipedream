import common from "../common/common-business.mjs";

const {
  props: {
    app, ...props
  },
} = common;

export default {
  ...common,
  key: "highlevel_oauth-create-business",
  name: "Create Business",
  description: "Creates a new business in HighLevel. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/businesses/create-business)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    ...props,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the business, e.g. `Microsoft`",
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      app, ...data
    } = this.getData();
    const response = await app.createBusiness({
      $,
      data,
    });

    $.export("$summary", `Successfully created business (ID: ${response?.buiseness?.id ?? response?.business?.id})`);
    return response;
  },
};
