import app from "../../recruiterflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "recruiterflow-search-candidates",
  name: "Search Candidates",
  description: "Searches for candidates matching specified criteria in Recruiterflow. Supports both simple searches and advanced filter arrays. [See the documentation](https://recruiterflow.com/swagger.yml)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    conjunction: {
      type: "string",
      label: "Conjunction",
      description: "How to combine multiple filters",
      options: [
        {
          label: "Match All (AND)",
          value: "match-all",
        },
        {
          label: "Match Any (OR)",
          value: "match-any",
        },
      ],
      default: "match-all",
    },
    filters: {
      type: "string[]",
      label: "Filters",
      description: "Array of filter objects as JSON strings. Each filter should have `type`, `key`, and other properties based on filter type. Example: `{\"type\": \"text\", \"conjunction\": \"in\", \"values\": [\"John\"], \"key\": \"name\"}`. Leave empty to use simple search fields below.",
      optional: true,
    },
    itemsPerPage: {
      type: "integer",
      label: "Items Per Page",
      description: "Number of results to return per page",
      default: 20,
    },
    currentPage: {
      type: "integer",
      label: "Current Page",
      description: "Page number to retrieve",
      default: 1,
    },
    includeCount: {
      type: "boolean",
      label: "Include Count",
      description: "Whether to include total count in response",
      optional: true,
      default: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Search by candidate name (simple search)",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Search by candidate email (simple search)",
      optional: true,
    },
    textSearch: {
      type: "string",
      label: "Text Search",
      description: "Search in resume, notes, emails, and files (simple search)",
      optional: true,
    },
    includeNotes: {
      type: "boolean",
      label: "Include Notes in Text Search",
      description: "Include notes when using text search",
      optional: true,
      default: true,
    },
    includeFiles: {
      type: "boolean",
      label: "Include Files in Text Search",
      description: "Include files when using text search",
      optional: true,
      default: true,
    },
    includeEmails: {
      type: "boolean",
      label: "Include Emails in Text Search",
      description: "Include emails when using text search",
      optional: true,
      default: true,
    },
    skills: {
      type: "string[]",
      label: "Skills",
      description: "Filter by skills (simple search)",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Filter by job title (simple search)",
      optional: true,
    },
    currentCompany: {
      type: "string",
      label: "Current Company",
      description: "Filter by current company (simple search)",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Filter by phone number (simple search)",
      optional: true,
    },
    linkedinProfile: {
      type: "string",
      label: "LinkedIn Profile",
      description: "Filter by LinkedIn profile URL (simple search)",
      optional: true,
    },
    school: {
      type: "string",
      label: "School",
      description: "Filter by school (simple search)",
      optional: true,
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
      conjunction,
      filters,
      itemsPerPage,
      currentPage,
      includeCount,
      name,
      email,
      textSearch,
      includeNotes,
      includeFiles,
      includeEmails,
      skills,
      jobTitle,
      currentCompany,
      phoneNumber,
      linkedinProfile,
      school,
    } = this;

    let filtersArray = [];

    // Parse filters if provided as JSON strings
    if (filters && filters.length > 0) {
      filtersArray = utils.parseJson(filters);
    } else {
      // If no advanced filters provided, build simple filters from individual fields

      if (name) {
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: [
            name,
          ],
          key: "name",
        });
      }

      if (email) {
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: [
            email,
          ],
          key: "email",
        });
      }

      if (textSearch) {
        const searchWords = textSearch.split(" ").filter((word) => word.length > 0);
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: searchWords,
          key: "text_search",
          include_notes: includeNotes,
          include_files: includeFiles,
          include_emails: includeEmails,
        });
      }

      if (skills && skills.length > 0) {
        filtersArray.push({
          type: "multi-select",
          conjunction: "in",
          values: skills,
          key: "skills",
        });
      }

      if (jobTitle) {
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: [
            jobTitle,
          ],
          key: "job_title",
        });
      }

      if (currentCompany) {
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: [
            currentCompany,
          ],
          key: "current_company",
        });
      }

      if (phoneNumber) {
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: [
            phoneNumber,
          ],
          key: "phone_number",
        });
      }

      if (linkedinProfile) {
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: [
            linkedinProfile,
          ],
          key: "linkedin_profile",
        });
      }

      if (school) {
        filtersArray.push({
          type: "text",
          conjunction: "in",
          values: [
            school,
          ],
          key: "school",
        });
      }
    }

    const data = {
      conjunction,
      items_per_page: itemsPerPage,
      current_page: currentPage,
      include_count: includeCount,
    };

    if (filtersArray.length > 0) {
      data.filters = filtersArray;
    }

    const response = await app.searchCandidates({
      $,
      data,
    });

    const resultCount = response.data?.length || 0;
    const totalCount = response.total_items !== undefined
      ? ` (${response.total_items} total)`
      : "";
    $.export("$summary", `Found ${resultCount} candidate(s)${totalCount} matching search criteria`);
    return response;
  },
};
