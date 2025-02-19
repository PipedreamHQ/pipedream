import benchmarkone from "../../benchmarkone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "benchmarkone-add-tag",
  name: "Add Tag to Contact",
  description: "Adds tags to a contact. If the contact does not exist, it will be created first. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    benchmarkone,
    tagNames: {
      propDefinition: [
        benchmarkone,
        "tagNames",
      ],
    },
    email: {
      propDefinition: [
        benchmarkone,
        "email",
      ],
    },
    contactId: {
      propDefinition: [
        benchmarkone,
        "contactId",
      ],
      optional: true,
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
    const response = await this.benchmarkone.addTagToContact({
      contactId: this.contactId,
      contactEmail: this.contactEmail,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumbers: this.phoneNumbers,
      addresses: this.addresses,
      tagNames: this.tagNames,
    });

    const contactId = response.contactId;
    const addedTags = this.tagNames.join(", ");
    $.export("$summary", `Added tags [${addedTags}] to contact ID ${contactId}`);
    return response;
  },
};
