import jira from "../../jira.app.mjs";

export default {
  key: "jira-create-version",
  name: "Create Jira Version in project",
  description: "Creates a project version., [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-project-versions/#api-rest-api-3-version-post)",
  version: "0.1.12",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    projectID: {
      propDefinition: [
        jira,
        "projectID",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Version name",
      description: "The unique name of the version. Required when creating a version. The maximum length is 255 characters.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the version.",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Indicates that the version is archived.",
      optional: true,
    },
    released: {
      type: "boolean",
      label: "Released",
      description: "Indicates that the version is released. If the version is released a request to release again is ignored. Not applicable when creating a version.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start date",
      description: "The start date of the version. Expressed in ISO 8601 format (yyyy-mm-dd).",
      optional: true,
    },
    releaseDate: {
      type: "string",
      label: "Release date",
      description: "The release date of the version. Expressed in ISO 8601 format (yyyy-mm-dd).",
      optional: true,
    },
    moveUnfixedIssuesTo: {
      type: "string",
      label: "Move unfixed issues to",
      description: "The URL of the self link to the version to which all unfixed issues are moved when a version is released. Not applicable when creating a version. Optional when updating a version.",
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "Use expand to include additional information about version in the response. This parameter accepts a comma-separated list. Expand options include:\n`operations` Returns the list of operations available for this version.\n`issuesstatus` Returns the count of issues in this version for each of the status categories `to do`, `in progress`, `done`, and `unmapped`.",
    },
  },
  async run({ $ }) {
    const response = await this.jira.createVersion({
      $,
      cloudId: this.cloudId,
      data: {
        projectId: this.projectID,
        name: this.name,
        description: this.description,
        archived: this.archived,
        released: this.released,
        startDate: this.startDate,
        releaseDate: this.releaseDate,
        moveUnfixedIssuesTo: this.moveUnfixedIssuesTo,
        expand: this.expand,
      },
    });
    $.export("$summary", `Version has been created successfuly. (ID:${response.id}, NAME:${response.name})`);
    return response;
  },
};
