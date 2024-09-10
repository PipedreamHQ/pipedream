import agiliron from "../../agiliron.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiliron-create-contact",
  name: "Create Contact",
  description: "Generates a new contact within Agiliron. [See the documentation](https://api.agiliron.com/docs/add-contact-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agiliron,
    lastname: {
      propDefinition: [
        agiliron,
        "lastname",
      ],
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    company: {
      propDefinition: [
        agiliron,
        "company",
      ],
      optional: true,
    },
    subject: {
      propDefinition: [
        agiliron,
        "subject",
      ],
      optional: true,
    },
    startdate: {
      propDefinition: [
        agiliron,
        "startdate",
      ],
      optional: true,
    },
    starttime: {
      propDefinition: [
        agiliron,
        "starttime",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      LastName: this.lastname,
      ...(this.firstname && {
        FirstName: this.firstname,
      }),
      ...(this.email && {
        Email: this.email,
      }),
      ...(this.phone && {
        Phone: this.phone,
      }),
      ...(this.company && {
        Company: this.company,
      }),
      ...(this.subject && {
        Subject: this.subject,
      }),
      ...(this.startdate && {
        StartDate: this.startdate,
      }),
      ...(this.starttime && {
        StartTime: this.starttime,
      }),
    };

    const response = await this.agiliron.addContact(data);

    $.export("$summary", `Successfully created contact: ${this.lastname}`);
    return response;
  },
};
