import linearApp from "../../linear_app.app.mjs";

export default {
  type: "action",
  key: "linear_app-create-project",
  name: "Create Project",
  description: "Create an project (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#queries-and-mutations)",
  version: "0.0.1",
  props: {
    linearApp,
    color: {
      type: "string",
      label: "Color",
      description: "The color of the project.",
      optional: true,
    },
    convertedFromIssueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      label: "Converted From Issue Id.",
      description: "The ID of the issue from which that project is created.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description for the project.",
      optional: true,
    },
    icon: {
      type: "string",
      label: "Icon",
      description: "The icon of the project.",
      optional: true,
    },
    lastAppliedTemplateId: {
      propDefinition: [
        linearApp,
        "templateId",
      ],
      optional: true,
    },
    leadId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
      label: "Lead Id",
      description: "The identifier of the project lead.",
      optional: true,
    },
    memberIds: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
      type: "string[]",
      label: "Member Ids",
      description: "The identifiers of the members of this project.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The planned start date of the project in ISO 8601 format.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the project.",
      optional: true,
      options: [
        "backlog",
        "planned",
        "started",
        "paused",
        "completed",
        "canceled",
      ],
    },
    targetDate: {
      type: "string",
      label: "Target Date",
      description: "The planned target date of the project in ISO 8601 format.",
      optional: true,
    },
    teamIds: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      type: "string[]",
      label: "Team Ids",
      description: "The identifiers of the teams this project is associated with.",
    },
  },
  async run({ $ }) {
    const {
      linearApp,
      ...data
    } = this;

    const response = await linearApp.createProject({
      ...data,
    });

    const summary = response.success
      ? `Created project ${response._project.id}`
      : "Failed to create project";
    $.export("$summary", summary);

    return response;
  },
};
