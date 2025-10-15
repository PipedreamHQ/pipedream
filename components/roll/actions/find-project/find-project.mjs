import _ from "lodash";
import moment from "moment";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-project",
  name: "Find Project",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    if (variables.dueDate) variables.dueDate = moment(new Date(variables.dueDate)).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    if (variables.startDate) variables.startDate = moment(new Date(variables.startDate)).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    if (variables.endDate) variables.endDate = moment(new Date(variables.endDate)).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    let projectLength = 0;
    let offset = 0;
    const limit = 50;
    const responseArray = [];

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

    $.export("$summary", "Projects successfully fetched!");
    return responseArray;
  },
};
