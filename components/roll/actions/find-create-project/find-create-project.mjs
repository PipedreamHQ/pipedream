import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-create-project",
  name: "Find Or Create Project",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find a project or create it if it doesn't exists [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    companyId: {
      propDefinition: [
        roll,
        "companyId",
      ],
      optional: true,
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
      propDefinition: [
        roll,
        "color",
      ],
      optional: true,
    },
    value: {
      propDefinition: [
        roll,
        "value",
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
    endDate: {
      propDefinition: [
        roll,
        "endDate",
      ],
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

    let projectLength = 0;
    let offset = 0;
    const limit = 50;
    let responseArray = [];
    do {
      const { project } = await this.roll.makeRequest({
        variables: {
          ..._.pickBy(variables),
          limit,
          offset,
        },
        query: "listProjects",
      });

      projectLength = project.length;
      responseArray.push(...project);
      offset += limit;
    } while (projectLength);

    let summary = "Projects successfully fetched!";

    if (!responseArray.length) {
      responseArray = await this.roll.makeRequest({
        variables: _.pickBy(variables),
        query: "addProject",
        type: "mutation",
      });
      const { addProject: { ProjectId } } = responseArray;
      summary = `Project successfully created with Id ${ProjectId}!`;
    }

    $.export("$summary", summary);
    return responseArray;
  },
};
