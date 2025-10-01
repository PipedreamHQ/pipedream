import hive from "../../hive.app.mjs";

export default {
  key: "hive-create-action-for-project",
  name: "Create Action For Project",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create an action for given project [See the documentation](https://developers.hive.com/v1.0/reference/actionscreate-1)",
  type: "action",
  props: {
    hive,
    workspaceId: {
      propDefinition: [
        hive,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        hive,
        "projectId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    title: {
      propDefinition: [
        hive,
        "title",
      ],
    },
    description: {
      propDefinition: [
        hive,
        "description",
      ],
      optional: true,
    },
    assignees: {
      propDefinition: [
        hive,
        "assignees",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        hive,
        "labels",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
      optional: true,
    },
    deadline: {
      propDefinition: [
        hive,
        "deadline",
      ],
      optional: true,
    },
    scheduledDate: {
      propDefinition: [
        hive,
        "scheduledDate",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        hive,
        "customFields",
      ],
      optional: true,
    },
    parentId: {
      propDefinition: [
        hive,
        "parentId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
      optional: true,
    },
    phaseId: {
      propDefinition: [
        hive,
        "phaseId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    phaseName: {
      propDefinition: [
        hive,
        "phaseName",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      hive,
      ...data
    } = this;

    const response = await hive.createAction({
      $,
      data,
    });

    $.export("$summary", `A new action with Id: ${response.id} was successfully created!`);
    return response;
  },
};
