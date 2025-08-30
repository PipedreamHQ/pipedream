import bamboohr from "../../bamboohr.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bamboohr-list-applications",
  name: "List Applications",
  description: "List all applications. [See the documentation](https://documentation.bamboohr.com/reference/get-applications)",
  version: "0.0.1",
  type: "action",
  props: {
    bamboohr,
    jobId: {
      propDefinition: [
        bamboohr,
        "jobId",
      ],
    },
    statusId: {
      propDefinition: [
        bamboohr,
        "statusId",
      ],
      optional: true,
    },
    statusGroup: {
      type: "string",
      label: "Status Group",
      description: "The group of statuses to filter by",
      options: constants.APPLICATION_STATUS_GROUPS,
      optional: true,
    },
    jobStatusGroup: {
      type: "string",
      label: "Job Status Group",
      description: "The group of job statuses to filter by",
      options: constants.JOB_STATUS_GROUPS,
      optional: true,
    },
    searchString: {
      type: "string",
      label: "Search String",
      description: "A general search criteria by which to find applications",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort by",
      options: constants.APPLICATION_SORT_FIELDS,
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "The order in which to sort the results",
      options: [
        "ASC",
        "DESC",
      ],
      optional: true,
    },
    newSince: {
      type: "string",
      label: "New Since",
      description: "Only get applications newer than a given UTC timestamp, for example `2024-01-01 13:00:00`",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listApplications({
      $,
      params: {
        jobId: this.jobId,
        applicationStatusId: this.statusId,
        applicationStatus: this.statusGroup,
        jobStatusGroups: this.jobStatusGroup,
        searchString: this.searchString,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        newSince: this.newSince,
        page: this.page,
      },
    });
    $.export("$summary", `Found ${response.applications.length} applications`);
    return response;
  },
};
