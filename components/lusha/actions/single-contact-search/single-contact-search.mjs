import { ConfigurationError } from "@pipedream/platform";
import { FILTER_BY_OPTIONS } from "../../common/constants.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-single-contact-search",
  name: "Search Single Contact",
  description: "Search for a single contact using various filters. [See the documentation](https://docs.lusha.com/apis/index2/person/personcontroller_searchsinglecontact)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lusha,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the person",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the person",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company the person works at",
      optional: true,
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The domain name of the company",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn URL of the person",
      optional: true,
    },
    refreshJobInfo: {
      type: "boolean",
      label: "Refresh Job Info",
      description: "Set to true to refresh and update the job details for the person. This ensures that outdated job information is replaced with the most recent data",
      optional: true,
    },
    filterBy: {
      type: "string",
      label: "Filter By",
      description: "Filters results based on specific contact details. By default, results will include contacts with at least one contact detail",
      optional: true,
      options: FILTER_BY_OPTIONS,
    },
    revealEmails: {
      type: "boolean",
      label: "Reveal Emails",
      description: "Whether to reveal email addresses in the response",
      optional: true,
    },
    revealPhones: {
      type: "boolean",
      label: "Reveal Phones",
      description: "Whether to reveal phone numbers in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.lusha.searchSingleContact({
        $,
        params: {
          firstName: this.firstName,
          lastName: this.lastName,
          companyName: this.companyName,
          companyDomain: this.companyDomain,
          email: this.email,
          linkedinUrl: this.linkedinUrl,
          refreshJobInfo: this.refreshJobInfo,
          filterBy: this.filterBy,
          revealEmails: this.revealEmails,
          revealPhones: this.revealPhones,
        },
      });
      let summary = "";
      if (response.contact?.error?.name) {

        if (response.contact.error.name !== "EMPTY_DATA") {
          throw new Error(response.contact.error.message || response.contact.error.name);
        }
        summary = "No contact found";
      }

      if (response.contact.data?.personId) {
        summary = `Successfully found a contact with ID: ${response.contact.data.personId}`;
      }
      $.export("$summary", summary);

      return response.contact.data;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
