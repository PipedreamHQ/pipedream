import redmine from "../../redmine.app.mjs";

export default {
  key: "redmine-create-issue",
  name: "Create Issue",
  description: "Creates a new issue in Redmine. [See the documentation](https://www.redmine.org/projects/redmine/wiki/rest_issues#creating-an-issue)",
  version: "0.0.1",
  type: "action",
  props: {
    redmine,
    projectId: {
      propDefinition: [
        redmine,
        "projectId",
      ],
    },
    subject: {
      propDefinition: [
        redmine,
        "subject",
      ],
    },
    description: {
      propDefinition: [
        redmine,
        "description",
      ],
    },
    statusId: {
      propDefinition: [
        redmine,
        "statusId",
      ],
    },
    priorityId: {
      propDefinition: [
        redmine,
        "priorityId",
      ],
    },
    trackerId: {
      propDefinition: [
        redmine,
        "trackerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.redmine.createIssue({
      data: {
        issue: {
          project_id: this.projectId,
          subject: this.subject,
          description: this.description,
          status_id: this.statusId,
          priority_id: this.priorityId,
          tracker_id: this.trackerId,
        },
      },
    });
    $.export("$summary", `Successfully created issue with ID: ${response.issue.id}`);
    return response;
  },
};
