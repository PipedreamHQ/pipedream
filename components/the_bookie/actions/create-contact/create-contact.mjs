import { axios } from "@pipedream/platform";
import thebookie from "../../the_bookie.app.mjs";

export default {
  key: "the_bookie-create-contact",
  name: "Create Contact",
  description: "Instantly creates a new contact in the address book. [See the documentation](https://app.thebookie.nl/nl/help/category/developers/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    the_bookie,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any extra notes for the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.the_bookie.createContact({
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address,
      notes: this.notes,
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}`);

    return response;
  },
};
