import donethat from "../../donethat.app.mjs";

export default {
  key: "donethat-update-project",
  name: "Update Project",
  description: "Rename, recolor, move, archive or unarchive an existing DoneThat project."
    + " Use **List Projects** to find the project ID; use **Create Project** for a new one."
    + " Only the fields you set are changed. Contributors replaces the whole list, and changing Team without Contributors resets contributors so the whole new team can log time."
    + " Confidential cannot be changed after creation, and projects cannot be deleted through the API: set Archived to `true` instead."
    + " [See the documentation](https://donethat.ai/api-reference/projects)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    donethat,
    projectId: {
      propDefinition: [
        donethat,
        "projectId",
      ],
    },
    name: {
      propDefinition: [
        donethat,
        "name",
      ],
    },
    description: {
      propDefinition: [
        donethat,
        "description",
      ],
    },
    color: {
      propDefinition: [
        donethat,
        "color",
      ],
    },
    team: {
      propDefinition: [
        donethat,
        "team",
      ],
    },
    portfolio: {
      propDefinition: [
        donethat,
        "portfolio",
      ],
    },
    isPrivate: {
      propDefinition: [
        donethat,
        "isPrivate",
      ],
    },
    contributorIds: {
      propDefinition: [
        donethat,
        "contributorIds",
      ],
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Set `true` to archive the project or `false` to unarchive it, e.g. `true`. Leave empty to keep its current state.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { project } = await this.donethat.updateProject({
      $,
      projectId: this.projectId,
      data: {
        name: this.name,
        description: this.description,
        color: this.color,
        team: this.team,
        portfolio: this.portfolio,
        private: this.isPrivate,
        contributorIds: this.contributorIds?.length
          ? this.contributorIds
          : undefined,
        archived: this.archived,
      },
    });

    $.export("$summary", `Updated project ${project.id}: ${project.name}`);
    return project;
  },
};
