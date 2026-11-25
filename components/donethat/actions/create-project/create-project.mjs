import donethat from "../../donethat.app.mjs";

export default {
  key: "donethat-create-project",
  name: "Create Project",
  description: "Create a DoneThat project that tracked work can be assigned to."
    + " Use **List Projects** first to avoid duplicates, since project names do not have to be unique, and **Update Project** to change or archive an existing one."
    + " Pass Team to create a team project; Contributors only work on team projects."
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
    contributorIds: {
      propDefinition: [
        donethat,
        "contributorIds",
      ],
    },
  },
  async run({ $ }) {
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
        contributorIds: this.contributorIds?.length
          ? this.contributorIds
          : undefined,
      },
    });

    $.export("$summary", `Created project ${project.id}: ${project.name}`);
    return project;
  },
};
