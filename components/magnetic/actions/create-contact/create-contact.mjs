import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See docs here](https://app.magnetichq.com/Magnetic/API.do#cl-contactobject)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    magnetic,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the new contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the new contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new contact",
      optional: true,
    },
    company: {
      propDefinition: [
        magnetic,
        "company",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      company: {
        id: this.company,
      },
      contactCompany: {
        id: this.company,
      },
    };

    const response = await this.magnetic.createContact({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.id}`);
    }

    return response;
  },
};
