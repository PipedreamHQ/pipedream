import app from "../../linkupapi.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "linkupapi-search-profiles",
  name: "Search Profiles",
  description: "Search for LinkedIn profiles based on criteria. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Profile/search)",
  version: "0.0.1",
  props: {
    app,
    loginToken: {
      propDefinition: [
        app,
        "loginToken",
      ],
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Search keyword to find relevant profiles",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name parameter for advanced keyword search",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name parameter for advanced keyword search",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "Job title parameter for advanced keyword search",
      optional: true,
    },
    companyUrl: {
      propDefinition: [
        app,
        "companyUrl",
      ],
    },
    location: {
      description: "Geographic locations to filter profiles",
      propDefinition: [
        app,
        "location",
      ],
    },
    schoolUrl: {
      type: "string[]",
      label: "School URLs",
      description: "LinkedIn school URLs",
      optional: true,
    },
    network: {
      type: "string[]",
      label: "Network Connection Level",
      description: "Filter by connection level",
      options: [
        {
          value: "F",
          label: "First-degree connections (1st)",
        },
        {
          value: "S",
          label: "Second-degree connections (2nd)",
        },
        {
          value: "O",
          label: "Out-of-network connections (3rd+)",
        },
      ],
      optional: true,
    },
    totalResults: {
      type: "integer",
      label: "Total Results",
      description: "Number of profiles to retrieve (default: `10`)",
      optional: true,
    },
    fetchInvitationState: {
      type: "boolean",
      label: "Fetch Invitation State",
      description: "Whether to fetch the invitation/connection status for each profile",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      loginToken,
      country,
      keyword,
      firstName,
      lastName,
      title,
      companyUrl,
      location,
      schoolUrl,
      network,
      totalResults,
      fetchInvitationState,
    } = this;

    const response = await app.searchProfiles({
      $,
      data: {
        login_token: loginToken,
        country,
        keyword,
        first_name: firstName,
        last_name: lastName,
        title,
        company_url: utils.getOptionalProp(companyUrl),
        location: utils.getOptionalProp(location),
        school_url: utils.getOptionalProp(schoolUrl),
        network: utils.getOptionalProp(network, ","),
        fetch_invitation_state: fetchInvitationState,
        total_results: totalResults,
      },
    });

    $.export("$summary", "Successfully retrieved profiles");
    return response;
  },
};
