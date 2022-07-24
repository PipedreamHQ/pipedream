import common from "../common/base-contact.mjs";

export default {
  ...common,
  key: "activecampaign-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Creates a new contact or updates an existing contact. See the docs [here](https://developers.activecampaign.com/reference/sync-a-contacts-data).",
  version: "0.2.3",
  type: "action",
  props: {
    ...common.props,
    orgid: {
      type: "integer",
      label: "Org ID",
      description: "`(Deprecated)` Please use Account-Contact end points.",
      optional: true,
    },
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "`(Deprecated)` Please use the DELETE endpoint.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response =
      await this.activecampaign.createOrUpdateContact({
        $,
        data: {
          contact: {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            fieldValues: this.getFieldValues(),
            orgid: this.orgid,
            deleted: this.deleted,
          },
        },
      });

    if (!response.contact) {
      throw new Error(JSON.stringify(response));
    }

    $.export("$summary", `Successfully created or updated contact "${response.contact.email}"`);

    return response;
  },
};
