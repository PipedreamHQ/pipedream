import roll from "../../roll.app.mjs";

export default {
  key: "roll-create-project",
  name: "Create Project",
  version: "0.0.1",
  description: "Create a new project [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    companyId: {
      propDefinition: [
        roll,
        "companyId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The project's title",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The project's description",
      optional: true,
    },
    status: {
      propDefinition: [
        roll,
        "projectStatus",
      ],
      optional: true,
    },
    subStatusId: {
      propDefinition: [
        roll,
        "projectStatus",
        (c) => ({
          parentId: c.status.value,
        }),
      ],
      label: "SubStatus Id",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The hexadecimal (color code)[https://www.w3schools.com/colors/colors_hexadecimal.asp].",
      optional: true,
    },
    jobNumber: {
      type: "string",
      label: "Job Number",
      description: "The identification number of the job.",
      optional: true,
    },
    projectAtRisk: {
      type: "boolean",
      label: "Project At Risk",
      description: "Whether the project is at risk or not.",
      optional: true,
    },
    projectType: {
      propDefinition: [
        roll,
        "projectType",
      ],
      optional: true,
    },
    projectLeadSourceId: {
      propDefinition: [
        roll,
        "projectLeadSourceId",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The project's amount.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The day by the project's must be done. Date format: `0000-00-00`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The day by the project's must be started. Date format: `0000-00-00`",
      optional: true,
    },
    lastDate: {
      type: "string",
      label: "Last Date",
      description: "The day by the project's must be finish. Date format: `0000-00-00`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      companyId,
      title,
      description,
      status,
      subStatusId,
      color,
      jobNumber,
      projectAtRisk,
      projectType,
      projectLeadSourceId,
      value,
      dueDate,
      startDate,
      lastDate,
    } = this;

    const response = await this.roll.addSchema({
      $,
      mutation: `addProject(
          CompanyId: ${companyId}
          ProjectTitle: "${title}"
          ProjectDescription: "${description}"
          ProjectStatus: "${status.label}"
          ProjectSubStatusId: "${subStatusId.value}"
          ProjectColor: "${color}"
          ProjectJobNumber: "${jobNumber}"
          ProjectAtRisk: ${+projectAtRisk}
          ProjectType: "${projectType}"
          ProjectLeadSourceId: ${projectLeadSourceId}
          ProjectValue: ${parseFloat(value)}
          DueDate: "${dueDate}"
          ProjectStartDate: "${startDate}"
          ProjectEndDate: "${lastDate}"
        ){
          ProjectId
        }`,
    });

    $.export("$summary", `Project successfully created with Id ${response.data.addProject.ProjectId}!`);
    return response;
  },
};
