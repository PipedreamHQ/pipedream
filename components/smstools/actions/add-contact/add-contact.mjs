import smstools from "../../smstools.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "smstools-add-contact",
  name: "Add Contact to Group",
  description: "Adds a new contact to an existing contact list. [See the documentation](https://www.smstools.com/en/sms-gateway-api/add_contact)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smstools,
    phone: {
      propDefinition: [
        smstools,
        "phone",
      ],
    },
    groupId: {
      propDefinition: [
        smstools,
        "groupId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Birthday of the contact.",
      optional: true,
    },
    extra1: {
      type: "string",
      label: "Extra 1",
      description: "Extra field 1 for the contact.",
      optional: true,
    },
    extra2: {
      type: "string",
      label: "Extra 2",
      description: "Extra field 2 for the contact.",
      optional: true,
    },
    extra3: {
      type: "string",
      label: "Extra 3",
      description: "Extra field 3 for the contact.",
      optional: true,
    },
    extra4: {
      type: "string",
      label: "Extra 4",
      description: "Extra field 4 for the contact.",
      optional: true,
    },
    extra5: {
      type: "string",
      label: "Extra 5",
      description: "Extra field 5 for the contact.",
      optional: true,
    },
    extra6: {
      type: "string",
      label: "Extra 6",
      description: "Extra field 6 for the contact.",
      optional: true,
    },
    extra7: {
      type: "string",
      label: "Extra 7",
      description: "Extra field 7 for the contact.",
      optional: true,
    },
    extra8: {
      type: "string",
      label: "Extra 8",
      description: "Extra field 8 for the contact.",
      optional: true,
    },
    unsubscribed: {
      type: "boolean",
      label: "Unsubscribed",
      description: "Indicates if the contact is unsubscribed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smstools.addContactToGroup({
      phone: this.phone,
      groupId: this.groupId,
      firstname: this.firstName,
      lastname: this.lastName,
      birthday: this.birthday,
      extra1: this.extra1,
      extra2: this.extra2,
      extra3: this.extra3,
      extra4: this.extra4,
      extra5: this.extra5,
      extra6: this.extra6,
      extra7: this.extra7,
      extra8: this.extra8,
      unsubscribed: this.unsubscribed,
    });

    $.export("$summary", `Successfully added contact with phone number ${this.phone}`);
    return response;
  },
};
