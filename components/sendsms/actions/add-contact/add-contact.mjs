import sendsms from "../../sendsms.app.mjs";

export default {
  key: "sendsms-add-contact",
  name: "Add Contact",
  description: "Add a new contact into a specified group in SendSMS. [See the documentation](https://www.sendsms.ro/api/#add-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendsms,
    groupId: {
      propDefinition: [
        sendsms,
        "groupId",
      ],
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "A phone number in E.164 Format but without the + sign (eg. 40727363767)",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the user",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendsms.addContact({
      $,
      params: {
        group_id: this.groupId,
        phone_number: this.phoneNumber,
        first_name: this.firstName,
        last_name: this.lastName,
      },
    });

    $.export("$summary", `The new contact was successfully created with Id: ${response.details}`);
    return response;
  },
};
