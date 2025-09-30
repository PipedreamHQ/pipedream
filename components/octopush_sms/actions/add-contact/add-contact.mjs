import octopush from "../../octopush_sms.app.mjs";

export default {
  key: "octopush_sms-add-contact",
  name: "Add Contact",
  description: "Adds a new contact to a list in the Octopush SMS Gateway. [See the documentation](https://dev.octopush.com/en/sms-gateway-api-documentation/add-a-contact/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    octopush,
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    listName: {
      type: "string",
      label: "List Name",
      description: "  Name of the list to which the contact should be added",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag Name",
      description: "Name of the tag that will be attached to the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.octopush.createContact({
      $,
      data: {
        list_name: this.listName,
        contacts: [
          {
            phone_number: this.phone,
            first_name: this.firstName,
            last_name: this.lastName,
          },
        ],
        tag_name: this.tag,
      },
    });
    $.export("$summary", "Successfully created contact.");
    return response;
  },
};
