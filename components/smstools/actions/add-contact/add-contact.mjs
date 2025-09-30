import { ConfigurationError } from "@pipedream/platform";
import smstools from "../../smstools.app.mjs";

export default {
  key: "smstools-add-contact",
  name: "Add Contact to Group",
  description: "Adds a new contact to an existing contact list. [See the documentation](https://www.smstools.com/en/sms-gateway-api/add_contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smstools,
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact.",
    },
    groupid: {
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
      description: "Birthday of the contact. **Format: YYYY-MM-DD**.",
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
    try {
      const {
        smstools,
        ...data
      } = this;

      const response = await smstools.addContact({
        $,
        data,
      });

      $.export("$summary", `Successfully added contact with ID: ${response.ID}`);
      return response;
    } catch (e) {
      throw new ConfigurationError(e.response.data.errorMsg);
    }
  },
};
