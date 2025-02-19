import benchmarkone from "../../benchmarkone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "benchmarkone-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in BenchmarkONE. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    benchmarkone,
    firstName: {
      propDefinition: [
        benchmarkone,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        benchmarkone,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        benchmarkone,
        "email",
      ],
    },
    phoneNumbers: {
      propDefinition: [
        benchmarkone,
        "phoneNumbers",
      ],
      optional: true,
    },
    addresses: {
      propDefinition: [
        benchmarkone,
        "addresses",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.benchmarkone.createContact({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumbers: this.phoneNumbers,
        addresses: this.addresses,
      });
      $.export("$summary", `Created contact with ID: ${response.contactId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to create contact: ${error.message}`);
    }
  },
};
