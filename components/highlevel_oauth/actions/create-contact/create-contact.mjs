import common from "../common/common-contacts.mjs";

const {
  props: {
    app, ...props
  },
} = common;

export default {
  ...common,
  key: "highlevel_oauth-create-contact",
  name: "Create Contact",
  description: "Creates a new contact on HighLevel. [See the documentation](https://highlevel.stoplight.io/docs/integrations/4c8362223c17b-create-contact)",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    const {
      app, ...data
    } = this.getData();
    const response = await app.createContact({
      $,
      data,
    });

    $.export("$summary", `Successfully created contact (ID: ${response?.contact?.id})`);
    return response;
  },
};
