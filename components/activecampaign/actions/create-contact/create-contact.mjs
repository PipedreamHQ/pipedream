import common from "../common/base-contact.mjs";

export default {
  ...common,
  key: "activecampaign-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the documentation](https://developers.activecampaign.com/reference#create-a-contact-new).",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const response =
      await this.activecampaign.createContact({
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

    $.export("$summary", `Successfully created contact "${response.contact.email}"`);

    return response;
  },
};
