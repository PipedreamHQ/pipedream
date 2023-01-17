import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-project",
  name: "Find Project",
  version: "0.0.1",
  description: "Find a project [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    projectId: {
      propDefinition: [
        roll,
        "projectId",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        roll,
        "companyId",
      ],
      optional: true,
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
    value: {
      type: "string",
      label: "Value",
      description: "The project's amount.",
      optional: true,
    },
    jobNumber: {
      type: "string",
      label: "Job Number",
      description: "The identification number of the job.",
      optional: true,
    },
    poNum: {
      type: "string",
      label: "PONum",
      description: "The purchase order number.",
      optional: true,
    },
    projectAtRisk: {
      type: "boolean",
      label: "Project At Risk",
      description: "Whether the project is at risk or not.",
      optional: true,
    },
    projectIsRetainer: {
      type: "string",
      label: "Project Is Retainer",
      description: "Whether the project is retainer or not.",
      options: [
        "Yes",
        "No",
      ],
      optional: true,
    },
    projectRetainerFrequency: {
      type: "integer",
      label: "Project Retainer Frequency",
      description: "The amount of time.",
      optional: true,
    },
    projectRetainerStartDate: {
      type: "string",
      label: "Project Retainer Start Date",
      description: "Specifies the period over the frequency. Date format: `0000-00-00T00:00:00.000Z`",
      optional: true,
    },
    completedDate: {
      type: "string",
      label: "Completed Date",
      description: "The date the project was completed. Date format: `0000-00-00T00:00:00.000Z`",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date by which the project must be done. Date format: `0000-00-00`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The day by the project must be started. Date format: `0000-00-00`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The day by the project must be finish. Date format: `0000-00-00`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      projectId,
      companyId,
      title,
      description,
      projectType,
      projectLeadSourceId,
      status,
      subStatusId,
      color,
      value,
      jobNumber,
      poNum,
      projectAtRisk,
      projectIsRetainer,
      projectRetainerFrequency,
      projectRetainerStartDate,
      completedDate,
      dueDate,
      startDate,
      endDate,
    } = this;

    let projectLength = 0;
    let offset = 0;
    const limit = 50;
    const responseArray = [];

    do {
      let filter = "(\n";

      if (projectId) filter += `ProjectId: ${projectId}\n`;
      if (companyId) filter += `CompanyId: ${companyId}\n`;
      if (title) filter += `ProjectTitle: "${title}"\n`;
      if (description) filter += `ProjectDescription: "${description}"\n`;
      if (projectType && projectType.length) filter += `ProjectType: "${projectType}"\n`;
      if (projectLeadSourceId) filter += `ProjectLeadSourceId: ${projectLeadSourceId}\n`;
      if (status) filter += `ProjectStatus: "${status.label}"\n`;
      if (subStatusId) filter += `ProjectSubStatusId: "${subStatusId.value}"\n`;
      if (color) filter += `ProjectColor: "${color}"\n`;
      if (value) filter += `ProjectValue: ${parseFloat(value)}\n`;
      if (jobNumber) filter += `ProjectJobNumber: "${jobNumber}"\n`;
      if (poNum) filter += `PONum: "${poNum}"\n`;
      if (projectAtRisk) filter += `ProjectAtRisk: ${+projectAtRisk}\n`;
      if (projectIsRetainer) filter += `ProjectIsRetainer: "${projectIsRetainer}"\n`;
      if (projectRetainerFrequency) filter += `ProjectRetainerFrequency: ${projectRetainerFrequency}\n
    ProjectRetainerPeriod: "Months"\n`;
      if (projectRetainerStartDate) filter += `ProjectRetainerStartDate: "${projectRetainerStartDate}"\n`;
      if (completedDate) filter += `CompletedDate: "${completedDate}"\n`;
      if (dueDate) filter += `DueDate: "${dueDate}"\n`;
      if (startDate) filter += `ProjectStartDate: "${startDate}"\n`;
      if (endDate) filter += `ProjectEndDate: "${endDate}"\n`;
      filter += `limit: ${limit}
      offset: ${offset}
    )`;

      const { data: { project } } = await this.roll.listProjects({
        $,
        filter,
      });

      projectLength = project.length;
      responseArray.push(...project);
      offset += limit;
    } while (projectLength);

    $.export("$summary", "Companies successfully fetched!");
    return {
      data: {
        company: responseArray,
      },
    };
  },
};
