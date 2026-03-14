import jira from "../../jira.app.mjs";

export default {
  key: "jira-create-version",
  name: "Create Jira Version in Project",
  description: "Creates a project version. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-project-versions/#api-rest-api-3-version-post)",
  version: "0.1.19",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jira,
    projectID: {
      propDefinition: [
        jira,
        "projectID",
      ],
    },
    name: {
      type: "string",
      label: "Version Name",
      description: "The unique name of the version. The maximum length is 255 characters.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the version",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Indicates that the version is archived",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the version. Expressed in ISO 8601 format (yyyy-mm-dd).",
      optional: true,
    },
    releaseDate: {
      type: "string",
      label: "Release Date",
      description: "The release date of the version. Expressed in ISO 8601 format (yyyy-mm-dd).",
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "Use expand to include additional information about the version in the response. This parameter accepts a comma-separated list. Expand options include:\n`operations` Returns the list of operations available for this version.\n`issuesstatus` Returns the count of issues in this version for each of the status categories `to do`, `in progress`, `done`, and `unmapped`.",
    },
  },
  /**
   * Runs the action and returns the API response.
   * @param {object} $ - The Pipedream step context
   * @returns {Promise<object>} The API response
   */
  async run({ $ }) {
    const response = await this.jira.createVersion({
      $,
      data: {
        projectId: this.projectID,
        name: this.name,
        description: this.description,
        archived: this.archived,
        startDate: this.startDate,
        releaseDate: this.releaseDate,
        expand: this.expand,
      },
    });
    $.export("$summary", `Version has been created successfuly. (ID:${response.id}, NAME:${response.name})`);
    return response;
  },
};
