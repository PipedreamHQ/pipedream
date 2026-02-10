import common from "../common/common-contacts.mjs";

const {
  props: {
    app, ...props
  },
} = common;

export default {
  ...common,
  key: "highlevel_oauth-upsert-contact",
  name: "Upsert Contact",
  description: "Creates or updates a contact on HighLevel. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact)",
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
    const response = await app.upsertContact({
      $,
      data,
    });

    $.export("$summary", `Successfully upserted contact (ID: ${response?.contact?.id})`);
    return response;
  },
};
