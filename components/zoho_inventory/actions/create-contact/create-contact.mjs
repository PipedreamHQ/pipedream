import zohoInventory from "../../zoho_inventory.app.mjs";

export default {
  key: "zoho_inventory-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Zoho Inventory. [See the docs here](https://www.zoho.com/inventory/api/v1/contacts/#create-a-contact)",
  version: "0.0.2",
  type: "action",
  props: {
    zohoInventory,
    organization: {
      propDefinition: [
        zohoInventory,
        "organization",
      ],
    },
    name: {
      type: "string",
      label: "Contact Name",
      description: "Name of the contact. This can be the name of an organization or the name of an individual",
    },
    type: {
      type: "string",
      label: "Contact Type",
      description: "Type of the contact",
      options: [
        "customer",
        "vendor",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "Email address of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      organization_id: this.organization,
    };
    const data = {
      contact_name: this.name,
      contact_type: this.type,
      website: this.website,
      contact_persons: [
        {
          email: this.email,
          phone: this.phone,
        },
      ],
    };
    const response = await this.zohoInventory.createContact({
      params,
      data,
      $,
    });
    $.export("$summary", `Successfully created contact ${this.name}`);
    return response;
  },
};
