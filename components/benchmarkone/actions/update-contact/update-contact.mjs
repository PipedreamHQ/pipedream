import benchmarkone from "../../benchmarkone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "benchmarkone-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact. [See the documentation](https://sandbox.hatchbuck.com/api/dist/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    benchmarkone: {
      type: "app",
      app: "benchmarkone",
    },
    contactId: {
      propDefinition: [
        benchmarkone,
        "contactId",
      ],
    },
    contactEmail: {
      propDefinition: [
        benchmarkone,
        "contactEmail",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        benchmarkone,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        benchmarkone,
        "lastName",
      ],
      optional: true,
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
    const response = await this.benchmarkone.updateContact({
      contactId: this.contactId,
      contactEmail: this.contactEmail,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumbers: this.phoneNumbers,
      addresses: this.addresses,
    });
    $.export("$summary", "Contact updated successfully.");
    return response;
  },
};
