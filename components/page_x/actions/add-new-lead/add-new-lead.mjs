import pageX from "../../page_x.app.mjs";

export default {
  key: "page_x-add-new-lead",
  name: "Add New Lead",
  description: "Create a new lead on PageX CRM. [See the documentation](https://rapidapi.com/thunderhurt/api/pagexcrm)",
  version: "0.0.1",
  type: "action",
  props: {
    pageX,
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique customer ID if exists",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the lead",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the lead",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pageX.createLead({
      $,
      data: {
        customer_id: this.customerId,
        email: this.email,
        phone: this.phone,
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created lead with email: ${this.email}`);
    return response;
  },
};
