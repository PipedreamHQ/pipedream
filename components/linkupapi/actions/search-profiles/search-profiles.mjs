import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-search-profiles",
  name: "Search Profiles",
  description: "Search for LinkedIn people. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/search-people)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    keyword: {
      propDefinition: [
        app,
        "keyword",
      ],
      description: "Free-text keyword to search people by (e.g. name, title, or company).",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Filter by first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Filter by last name.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Filter by current job title.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Filter by current company name.",
      optional: true,
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    companyUrl: {
      propDefinition: [
        app,
        "companyUrl",
      ],
    },
    pastCompany: {
      type: "string[]",
      label: "Past Companies",
      description: "Filter by past companies, passed as an array of LinkedIn company URLs.",
      optional: true,
    },
    schoolUrl: {
      type: "string[]",
      label: "School URLs",
      description: "Filter by schools, passed as an array of LinkedIn school URLs.",
      optional: true,
    },
    industry: {
      type: "string[]",
      label: "Industries",
      description: "Filter by industries, passed as an array of strings.",
      optional: true,
    },
    network: {
      type: "string[]",
      label: "Network",
      description: "Filter by network degree, passed as an array (e.g. `[\"F\"]` for 1st, `[\"S\"]` for 2nd, `[\"O\"]` for 3rd+).",
      optional: true,
    },
    connectionOf: {
      type: "string",
      label: "Connection Of",
      description: "Return people who are connections of this profile (LinkedIn profile URN or public identifier).",
      optional: true,
    },
    followerOf: {
      type: "string",
      label: "Follower Of",
      description: "Return people who are followers of this profile (LinkedIn profile URN or public identifier).",
      optional: true,
    },
    fetchInvitationState: {
      type: "boolean",
      label: "Fetch Invitation State",
      description: "Whether to include each result's connection/invitation state.",
      optional: true,
    },
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchProfiles({
      $,
      accountId: this.accountId,
      params: {
        keyword: this.keyword,
        first_name: this.firstName,
        last_name: this.lastName,
        title: this.title,
        company_name: this.companyName,
        location: this.location,
        company_url: this.companyUrl,
        past_company: this.pastCompany,
        school_url: this.schoolUrl,
        industry: this.industry,
        network: this.network,
        connection_of: this.connectionOf,
        follower_of: this.followerOf,
        fetch_invitation_state: this.fetchInvitationState,
        total_results: this.totalResults,
      },
    });

    const count = response.data?.results?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} profile${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
