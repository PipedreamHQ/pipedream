import ringover from "../../ringover.app.mjs";

export default {
  key: "ringover-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Ringover. [See the documentation](https://developer.ringover.com/?_ga=2.63646317.316145444.1695076986-652152469.1694643800#tag/contacts/paths/~1contacts/post)",
  version: "0.0.1",
  type: "action",
  props: {
    ringover,
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
    company: {
      type: "string",
      label: "Company",
      description: "Company of the contact",
      optional: true,
    },
    isShared: {
      type: "boolean",
      label: "Is Shared",
      description: "Whether the contact is shared",
      optional: true,
    },
    number: {
      type: "integer",
      label: "Number",
      description: "Phone number of the contact (E.164 format)",
    },
    numberType: {
      type: "string",
      label: "Number Type",
      description: "The type of the phone number",
      optional: true,
      options: [
        "home",
        "office",
        "mobile",
        "fax",
        "other",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ringover.createContact({
      $,
      data: {
        new_contact_request: {
          contacts: [
            {
              firstname: this.firstName,
              lastname: this.lastName,
              company: this.company,
              is_shared: this.isShared,
              numbers: [
                {
                  number: this.number,
                  type: this.numberType,
                },
              ],
            },
          ],
        },
      },
    });
    $.export("$summary", "Successfully created contact");
    return response;
  },
};
