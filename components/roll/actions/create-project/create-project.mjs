import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-create-project",
  name: "Create Project",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        roll,
        "title",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        roll,
        "description",
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
      description: "The project's sub status.",
      optional: true,
    },
    color: {
      propDefinition: [
        roll,
        "color",
      ],
      optional: true,
    },
    jobNumber: {
      propDefinition: [
        roll,
        "jobNumber",
      ],
      optional: true,
    },
    projectAtRisk: {
      propDefinition: [
        roll,
        "projectAtRisk",
      ],
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
      propDefinition: [
        roll,
        "value",
      ],
      optional: true,
    },
    dueDate: {
      propDefinition: [
        roll,
        "dueDate",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        roll,
        "startDate",
      ],
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
      // eslint-disable-next-line no-unused-vars
      roll,
      ...variables
    } = this;

    if (variables.status) variables.status = variables.status.label;
    if (variables.subStatusId) variables.subStatusId = variables.subStatusId.value;
    if (variables.projectAtRisk) variables.projectAtRisk = +variables.projectAtRisk;
    if (variables.projectType) variables.projectType = variables.projectType.toString();

    const response = await this.roll.makeRequest({
      variables: _.pickBy(variables),
      query: "addProject",
      type: "mutation",
    });

    $.export("$summary", `Project successfully created with Id ${response.addProject.ProjectId}!`);
    return response;
  },
};
