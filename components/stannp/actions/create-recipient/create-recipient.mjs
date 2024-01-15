import stannp from "../../stannp.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "stannp-create-recipient",
  name: "Create a New Recipient",
  description: "Creates a new recipient in a specified group. [See the Stannp documentation](https://www.stannp.com/us/direct-mail-api/recipients)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    stannp,
    groupId: {
      propDefinition: [
        stannp,
        "groupId",
        async (opts) => {
          const { data } = await stannp.listGroups();
          return data.map((group) => ({
            label: group.name,
            value: group.id.toString(),
          }));
        },
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the recipient.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the recipient.",
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the address.",
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the address.",
      optional: true,
    },
    address3: {
      type: "string",
      label: "Address Line 3",
      description: "The third line of the address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the address.",
    },
    postcode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the address.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The ISO 3166-1 Alpha 2 Country Code (e.g., GB, US, FR).",
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address of the recipient.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the recipient.",
      optional: true,
    },
    refId: {
      type: "string",
      label: "Reference ID",
      description: "An alternative ID to associate the recipient with an ID in another service.",
      optional: true,
    },
    onDuplicate: {
      type: "string",
      label: "On Duplicate",
      description: "What to do if a duplicate recipient is found (update/ignore/duplicate).",
      options: [
        "update",
        "ignore",
        "duplicate",
      ],
      default: "update",
    },
  },
  async run({ $ }) {
    const recipientData = {
      firstname: this.firstName,
      lastname: this.lastName,
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      city: this.city,
      postcode: this.postcode,
      country: this.country,
      email: this.email,
      phone_number: this.phoneNumber,
      ref_id: this.refId,
      on_duplicate: this.onDuplicate,
    };

    const response = await this.stannp.createRecipient({
      groupId: this.groupId,
      recipientId: JSON.stringify(recipientData),
    });

    $.export("$summary", `Successfully created recipient with ID: ${response.id}`);
    return response;
  },
};
