import app from "../../redmine.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "redmine-update-project",
  name: "Update Project",
  description: "Updates an existing project in Redmine. [See the documentation](https://www.redmine.org/projects/redmine/wiki/rest_projects#updating-a-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the project",
      optional: true,
    },
    homepage: {
      type: "string",
      label: "Homepage",
      description: "The homepage of the project",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether the project is public",
      optional: true,
    },
    inheritMembers: {
      type: "boolean",
      label: "Inherit Members",
      description: "Whether the project should inherit members from its parent",
      optional: true,
    },
  },
  methods: {
    updateProject({
      projectId, ...args
    } = {}) {
      return this.app.put({
        path: `/projects/${projectId}.json`,
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      updateProject,
      projectId,
      ...project
    } = this;

    return updateProject({
      step,
      projectId,
      data: {
        project: utils.transformProps(project),
      },
      summary: () => "Successfully updated project",
    });
  },
};
