import { ConfigurationError } from "@pipedream/platform";
import benchmarkone from "../../benchmarkone.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "benchmarkone-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact. [See the documentation](https://sandbox.hatchbuck.com/api/dist/#!/Contacts/put_contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    benchmarkone,
    contactId: {
      propDefinition: [
        benchmarkone,
        "contactId",
      ],
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
    title: {
      propDefinition: [
        benchmarkone,
        "title",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        benchmarkone,
        "company",
      ],
      optional: true,
    },
    workEmail: {
      propDefinition: [
        benchmarkone,
        "workEmail",
      ],
      optional: true,
    },
    homeEmail: {
      propDefinition: [
        benchmarkone,
        "homeEmail",
      ],
      optional: true,
    },
    workPhone: {
      propDefinition: [
        benchmarkone,
        "workPhone",
      ],
      optional: true,
    },
    homePhone: {
      propDefinition: [
        benchmarkone,
        "homePhone",
      ],
      optional: true,
    },
    workAddress: {
      propDefinition: [
        benchmarkone,
        "workAddress",
      ],
      optional: true,
    },
    homeAddress: {
      propDefinition: [
        benchmarkone,
        "homeAddress",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        benchmarkone,
        "status",
      ],
      optional: true,
    },
    temperature: {
      propDefinition: [
        benchmarkone,
        "temperature",
      ],
      optional: true,
    },
    website: {
      propDefinition: [
        benchmarkone,
        "website",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const emails = [];
      if (this.workEmail) {
        emails.push({
          address: this.workEmail,
          type: "Work",
        });
      }
      if (this.homeEmail) {
        emails.push({
          address: this.homeEmail,
          type: "Home",
        });
      }
      const phones = [];
      if (this.workPhone) {
        phones.push({
          number: this.workPhone,
          type: "Work",
        });
      }
      if (this.homePhone) {
        phones.push({
          number: this.homePhone,
          type: "Home",
        });
      }
      const addresses = [];
      if (this.workAddress) {
        addresses.push({
          ...parseObject(this.workAddress),
          type: "Work",
        });
      }
      if (this.homeAddress) {
        addresses.push({
          ...parseObject(this.homeAddress),
          type: "Home",
        });
      }

      const data = {
        contactId: this.contactId,
        firstName: this.firstName,
        lastName: this.lastName,
        emails,
        phones,
        addresses,
      };
      if (this.status) {
        data.status = {
          name: this.status.label,
          id: this.status.value,
        };
      }
      if (this.temperature) {
        data.temperature = {
          name: this.temperature.label,
          id: this.temperature.value,
        };
      }
      if (this.website) {
        data.website = [
          {
            websiteUrl: this.website,
          },
        ];
      }

      const response = await this.benchmarkone.updateContact({
        $,
        data,
      });
      $.export("$summary", "Contact updated successfully.");
      return response;
    } catch (error) {
      throw new ConfigurationError(`Failed to create contact: ${error.message}`);
    }
  },
};
