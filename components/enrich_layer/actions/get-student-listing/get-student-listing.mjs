import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-student-listing",
  name: "Get Student Listing",
  description: "Get a list of students of a school. Cost: 3 credits per student returned. [See the documentation](https://enrichlayer.com/docs/api/v2/school-api/student-listing).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    schoolUrl: {
      type: "string",
      label: "School Profile URL",
      description: "The professional network URL of the school (e.g., `https://www.linkedin.com/school/stanford-university`).",
    },
    enrichProfiles: {
      propDefinition: [
        enrichlayer,
        "enrichProfiles",
      ],
    },
    booleanSearchKeyword: {
      type: "string",
      label: "Boolean Search Keyword",
      description: "Filter students by their major using boolean search expression (e.g., `computer OR cs`). Max 255 characters. Costs 10 base credits + 6 credits per student.",
      optional: true,
    },
    country: {
      propDefinition: [
        enrichlayer,
        "country",
      ],
      description: "Filter students by country. Costs an extra 3 credits per result.",
    },
    pageSize: {
      propDefinition: [
        enrichlayer,
        "pageSize",
      ],
    },
    studentStatus: {
      type: "string",
      label: "Student Status",
      description: "Filter by student status.",
      optional: true,
      options: [
        {
          label: "Current (default)",
          value: "current",
        },
        {
          label: "Past",
          value: "past",
        },
        {
          label: "All",
          value: "all",
        },
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort students by matriculation or graduation dates. Adds 50 credits base + 10 credits per student.",
      optional: true,
      options: [
        {
          label: "None (default)",
          value: "none",
        },
        {
          label: "Recently Matriculated",
          value: "recently-matriculated",
        },
        {
          label: "Recently Graduated",
          value: "recently-graduated",
        },
      ],
    },
    resolveNumericId: {
      type: "boolean",
      label: "Resolve Numeric ID",
      description: "Enable support for school profile URLs with numerical IDs. Costs 2 extra credits.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.getStudentListing({
      $,
      params: {
        school_url: this.schoolUrl,
        enrich_profiles: this.enrichProfiles,
        boolean_search_keyword: this.booleanSearchKeyword,
        country: this.country,
        page_size: this.pageSize,
        student_status: this.studentStatus,
        sort_by: this.sortBy,
        resolve_numeric_id: this.resolveNumericId,
      },
    });
    $.export("$summary", `Successfully retrieved students from ${this.schoolUrl}`);
    return response;
  },
};
