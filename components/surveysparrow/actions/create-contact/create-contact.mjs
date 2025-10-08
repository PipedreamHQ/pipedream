import surveySparrow from "../../surveysparrow.app.mjs";

export default {
  key: "surveysparrow-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://developers.surveysparrow.com/rest-apis/contacts#postV3Contacts)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    surveySparrow,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Full name of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the contact",
      optional: true,
    },
    contactType: {
      propDefinition: [
        surveySparrow,
        "contactType",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.surveySparrow.createContact({
      $,
      data: {
        email: this.email,
        full_name: this.fullName,
        phone: this.phone,
        job_title: this.jobTitle,
        contact_type: this.contactType,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created contact with ID ${response.id}`);
    }

    return response;
  },
};
