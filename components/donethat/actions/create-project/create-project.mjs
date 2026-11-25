import { ConfigurationError } from "@pipedream/platform";
import donethat from "../../donethat.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "donethat-create-project",
  name: "Create Project",
  description: "Create a DoneThat project that tracked work can be assigned to."
    + " Use **List Projects** first to avoid duplicates, since project names do not have to be unique, and **Update Project** to change or archive an existing one."
    + " Pass Team to create a team project; Contributor Access and Contributors only work on team projects, and every team member can log time unless you restrict it."
    + " If Name is empty, DoneThat names the project after today's date, e.g. `New Project 2026-05-19`."
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
    isConfidential: {
      type: "boolean",
      label: "Confidential",
      description: "Whether the project is confidential, e.g. `false`. Can only be set when the project is created.",
      optional: true,
    },
    contributorAccess: {
      propDefinition: [
        donethat,
        "contributorAccess",
      ],
      description: "Who can log time to the team project. `everyone` lets every member of the team log time;"
        + " `selected` limits it to the people in Contributors, and nobody can log time if Contributors is empty."
        + " Leave empty for `everyone`, or for `selected` when Contributors is set. Requires Team.",
    },
    contributorIds: {
      propDefinition: [
        donethat,
        "contributorIds",
      ],
    },
  },
  async run({ $ }) {
    const contributorIds = utils.buildContributorIds({
      access: this.contributorAccess,
      ids: this.contributorIds,
    });
    if (contributorIds !== undefined && !this.team) {
      throw new ConfigurationError("Contributor Access and Contributors only work on team projects. Set Team, or leave both empty.");
    }

    const { project } = await this.donethat.createProject({
      $,
      data: {
        name: this.name,
        description: this.description,
        color: this.color,
        team: this.team,
        portfolio: this.portfolio,
        private: this.isPrivate,
        confidential: this.isConfidential,
        contributorIds,
      },
    });

    $.export("$summary", `Created project ${project.id}: ${project.name}`);
    return project;
  },
};
