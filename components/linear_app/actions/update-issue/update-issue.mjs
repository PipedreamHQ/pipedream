import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-issue",
  name: "Update Issue",
  description: "Updates an existing Linear issue. All fields are optional; only provided fields are changed — prior values are preserved for any omitted field. Use **Get Teams** for team IDs, **List Workflow States** for state IDs, **List Users** for assignee IDs, **List Labels** for label IDs, and **Search Issues** for the issue ID. Example: `issueId: \"iss_01abc\"`, `stateId: \"state_done_xyz\"` → returns `{success: true, issue: {id: \"iss_01abc\", identifier: \"ENG-42\", state: {name: \"Done\"}}}`. [See the documentation](https://linear.app/developers/graphql#creating-and-editing-issues).",
  type: "action",
  ai: "optimized",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
    },
    title: {
      optional: true,
      propDefinition: [
        linearApp,
        "issueTitle",
      ],
    },
    description: {
      optional: true,
      propDefinition: [
        linearApp,
        "issueDescription",
      ],
    },
    teamIdToUpdate: {
      description: "The UUID of the team to move the issue to (e.g. `9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f`). Omit to leave the issue's team unchanged. Use **Get Teams** to discover valid team IDs.",
      optional: true,
      propDefinition: [
        linearApp,
        "teamId",
      ],
    },
    stateId: {
      propDefinition: [
        linearApp,
        "stateId",
      ],
    },
    assigneeId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
    },
    labelIds: {
      propDefinition: [
        linearApp,
        "issueLabelIds",
      ],
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    priority: {
      propDefinition: [
        linearApp,
        "issuePriority",
      ],
    },
  },
  async run({ $ }) {
    const {
      issueId,
      title,
      description,
      teamIdToUpdate,
      stateId,
      assigneeId,
      labelIds,
      projectId,
      priority,
    } = this;

    const response =
      await this.linearApp.updateIssue({
        issueId,
        input: {
          teamId: teamIdToUpdate,
          title,
          description,
          assigneeId,
          stateId,
          labelIds,
          projectId,
          priority,
        },
      });

    const summary = response.success
      ? `Updated issue ${response._issue.id}`
      : "Failed to update issue";
    $.export("$summary", summary);

    return response;
  },
};
