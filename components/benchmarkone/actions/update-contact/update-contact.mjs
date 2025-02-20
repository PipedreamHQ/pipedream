import { ConfigurationError } from "@pipedream/platform";
import benchmarkone from "../../benchmarkone.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "benchmarkone-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact. [See the documentation](https://sandbox.hatchbuck.com/api/dist/#!/Contacts/put_contact)",
  version: "0.0.1",
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
    emails: {
      propDefinition: [
        benchmarkone,
        "emails",
      ],
      optional: true,
    },
    phones: {
      propDefinition: [
        benchmarkone,
        "phones",
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
      const data = {
        contactId: this.contactId,
        firstName: this.firstName,
        lastName: this.lastName,
        emails: parseObject(this.emails),
        phones: parseObject(this.phones),
        addresses: parseObject(this.addresses),
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
