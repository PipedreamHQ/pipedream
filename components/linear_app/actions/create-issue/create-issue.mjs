import linearApp from "../../linear_app.app.mjs";

export default {
  type: "action",
  ai: "optimized",
  key: "linear_app-create-issue",
  name: "Create Issue",
  description: "Creates a new issue in Linear. Requires a team ID and title; all other fields are optional. Use **Get Teams** to discover valid team IDs, **List Workflow States** to find state IDs, **List Users** to find assignee IDs, and **List Labels** to find label IDs. Example: `teamId: \"9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f\"`, `title: \"Fix login redirect on mobile\"` → returns `{success: true, issue: {id: \"iss_01\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\"}}`. [See the documentation](https://linear.app/developers/graphql#creating-and-editing-issues).",
  version: "0.4.22",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    title: {
      propDefinition: [
        linearApp,
        "issueTitle",
      ],
    },
    description: {
      propDefinition: [
        linearApp,
        "issueDescription",
      ],
    },
    assigneeId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
    },
    stateId: {
      propDefinition: [
        linearApp,
        "stateId",
      ],
    },
    labelIds: {
      propDefinition: [
        linearApp,
        "issueLabelIds",
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
      linearApp,
      projectId,
      title,
      description,
      teamId,
      assigneeId,
      stateId,
      labelIds,
      priority,
    } = this;

    const response =
      await linearApp.createIssue({
        teamId,
        projectId,
        title,
        description,
        assigneeId,
        stateId,
        labelIds,
        priority,
      });

    const summary = response.success
      ? `Created issue ${response._issue.id}`
      : "Failed to create issue";
    $.export("$summary", summary);

    return response;
  },
};
