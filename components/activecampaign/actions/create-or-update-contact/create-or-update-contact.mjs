import common from "../common/base-contact.mjs";

export default {
  ...common,
  key: "activecampaign-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Creates a new contact or updates an existing contact. [See the documentation](https://developers.activecampaign.com/reference/sync-a-contacts-data).",
  version: "0.2.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
