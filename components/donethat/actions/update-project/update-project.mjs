import donethat from "../../donethat.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "donethat-update-project",
  name: "Update Project",
  description: "Rename, recolor, move, archive or unarchive an existing DoneThat project."
    + " Use **List Projects** to find the project ID; use **Create Project** for a new one."
    + " Only the fields you set are changed. Contributor Access `everyone` lets the whole team log time again; Contributors replaces the whole list."
    + " Changing Team without Contributor Access or Contributors resets access so the whole new team can log time."
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
    contributorAccess: {
      propDefinition: [
        donethat,
        "contributorAccess",
      ],
      description: "Who can log time to the team project. `everyone` lets every member of the team log time and removes any restriction;"
        + " `selected` limits it to the people in Contributors, and nobody can log time if Contributors is empty."
        + " Leave empty to keep the current setting, or for `selected` when Contributors is set.",
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
        contributorIds: utils.buildContributorIds({
          access: this.contributorAccess,
          ids: this.contributorIds,
        }),
        archived: this.archived,
      },
    });

    $.export("$summary", `Updated project ${project.id}: ${project.name}`);
    return project;
  },
};
