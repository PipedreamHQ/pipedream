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
  description: "Creates or updates a contact on HighLevel. [See the documentation](https://highlevel.stoplight.io/docs/integrations/f71bbdd88f028-upsert-contact)",
  version: "0.0.2",
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
