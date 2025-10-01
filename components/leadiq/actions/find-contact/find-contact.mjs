import app from "../../leadiq.app.mjs";
import queries from "../../common/queries.mjs";

export default {
  key: "leadiq-find-contact",
  name: "Find Contact",
  description: "Searches for contact information based on user-defined props which may include identifiers such as name, email, or company. Returns the contact data if a match is found within the LeadIQ database. [See the documentation](https://developer.leadiq.com/#query-searchPeople)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
      optional: true,
    },
    searchInPastCompanies: {
      type: "boolean",
      label: "Search in Past Companies",
      description: "If enabled, the search will include past companies.",
      optional: true,
    },
  },
  methods: {
    searchContact({
      data, ...args
    } = {}) {
      return this.app.post({
        ...args,
        data: {
          ...data,
          query: queries.searchPeople,
        },
      });
    },
  },
  async run({ $ }) {
    const {
      searchContact,
      fullName,
      email,
      companyName,
      searchInPastCompanies,
    } = this;

    const { data: { searchPeople: { results } } } = await searchContact({
      $,
      data: {
        variables: {
          input: {
            limit: 1,
            fullName,
            email,
            ...(companyName && {
              company: {
                name: companyName,
                searchInPastCompanies,
              },
            }),
          },
        },
      },
    });

    if (!results.length) {
      $.export("$summary", `No contact information found for \`${fullName || email || companyName}\``);
      return {
        success: false,
      };
    }

    $.export("$summary", `Successfully found \`${results.length}\` contact(s)`);
    return results;
  },
};
