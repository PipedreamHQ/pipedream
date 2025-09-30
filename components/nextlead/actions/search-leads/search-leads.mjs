import nextlead from "../../nextlead.app.mjs";

export default {
  key: "nextlead-search-leads",
  name: "Search Leads",
  description: "Search for leads by email in NextLead. [See the documentation](https://dashboard.nextlead.app/en/api-documentation#find)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nextlead,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to search for",
    },
  },
  async run({ $ }) {
    const response = await this.nextlead.searchLeads({
      $,
      data: {
        email: this.email,
      },
    });
    $.export("$summary", `Found ${response.length && response[0].found
      ? response.length
      : 0} lead(s) for email: ${this.email}`);
    return response;
  },
};
