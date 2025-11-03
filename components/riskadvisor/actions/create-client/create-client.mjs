import riskadvisor from "../../riskadvisor.app.mjs";

export default {
  key: "riskadvisor-create-client",
  name: "Create Client",
  description: "Create a new client in RiskAdvisor. [See the documentation](https://api.riskadvisor.insure/clients#create-a-client)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    riskadvisor,
    firstName: {
      propDefinition: [
        riskadvisor,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        riskadvisor,
        "lastName",
      ],
    },
    phoneNumber: {
      propDefinition: [
        riskadvisor,
        "phoneNumber",
      ],
    },
    email: {
      propDefinition: [
        riskadvisor,
        "email",
      ],
    },
    middleName: {
      propDefinition: [
        riskadvisor,
        "middleName",
      ],
    },
    suffix: {
      propDefinition: [
        riskadvisor,
        "suffix",
      ],
    },
    dateOfBirth: {
      propDefinition: [
        riskadvisor,
        "dateOfBirth",
      ],
    },
    contactPreference: {
      propDefinition: [
        riskadvisor,
        "contactPreference",
      ],
    },
    gender: {
      propDefinition: [
        riskadvisor,
        "gender",
      ],
    },
    education: {
      propDefinition: [
        riskadvisor,
        "education",
      ],
    },
    occupation: {
      propDefinition: [
        riskadvisor,
        "occupation",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.riskadvisor.createClient({
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        phone_number: this.phoneNumber,
        email: this.email,
        middle_name: this.middleName,
        suffix: this.suffix,
        date_of_birth: this.dateOfBirth,
        contact_preference: this.contactPreference,
        gender: this.gender,
        education: this.education,
        occupation: this.occupation,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created client with ID ${response.id}.`);
    }

    return response;
  },
};
