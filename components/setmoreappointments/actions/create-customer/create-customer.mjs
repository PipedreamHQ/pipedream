import setmore from "../../setmoreappointments.app.mjs";

export default {
  key: "setmoreappointments-create-customer",
  name: "Create Customer",
  description: "Create a new customer in Setmore Appointments. [See the documentation](https://setmore.docs.apiary.io/#introduction/customers/create-a-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    setmore,
    first_name: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer.",
    },
    last_name: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer.",
      optional: true,
    },
    email_id: {
      type: "string",
      label: "Email",
      description: "The email of the customer.",
      optional: true,
    },
    country_code: {
      type: "string",
      label: "Country Code",
      description: "The country code of the customer's phone number.",
      optional: true,
    },
    cell_phone: {
      type: "string",
      label: "Cell Phone",
      description: "The cell phone number of the customer.",
      optional: true,
    },
    work_phone: {
      type: "string",
      label: "Work Phone",
      description: "The work phone number of the customer.",
      optional: true,
    },
    home_phone: {
      type: "string",
      label: "Home Phone",
      description: "The home phone number of the customer.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the customer.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the customer.",
      optional: true,
    },
    postal_code: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the customer.",
      optional: true,
    },
    image_url: {
      type: "string",
      label: "Image URL",
      description: "The image URL of the customer.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Any additional comments about the customer.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.setmore.createCustomer({
      data: {
        first_name: this.first_name,
        last_name: this.last_name,
        email_id: this.email_id,
        country_code: this.country_code,
        cell_phone: this.cell_phone,
        work_phone: this.work_phone,
        home_phone: this.home_phone,
        address: this.address,
        city: this.city,
        state: this.state,
        postal_code: this.postal_code,
        image_url: this.image_url,
        comment: this.comment,
      },
      $,
    });

    if (data?.customer) {
      $.export("$summary", `Successfully created customer with key ${data.customer.key}.`);
    }

    return data.customer;
  },
};
