import common from "../common/common-contacts.mjs";

const {
  props: {
    app, ...props
  },
} = common;

export default {
  ...common,
  key: "highlevel_oauth-update-contact",
  name: "Update Contact",
  description: "Updates a selected contact on HighLevel. [See the documentation](https://highlevel.stoplight.io/docs/integrations/9ce5a739d4fb9-update-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    ...props,
  },
  async run({ $ }) {
    const {
      app,
      contactId, ...data

    } = this.getData(false);
    const response = await app.updateContact({
      $,
      contactId,
      data,
    });

    $.export("$summary", `Successfully updated contact (ID: ${contactId})`);
    return response;
  },
};
