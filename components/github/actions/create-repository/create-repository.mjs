import github from "../../github.app.mjs";

export default {
  key: "github-create-repository",
  name: "Create Repository",
  description: "Creates a new repository for the authenticated user. [See the documentation](https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user)",
  version: "0.0.19",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    name: {
      label: "Name",
      description: "The name of the repository.",
      type: "string",
    },
    teamId: {
      propDefinition: [
        github,
        "teamId",
      ],
      optional: true,
    },
    description: {
      label: "Description",
      description: "A short description of the repository.",
      type: "string",
      optional: true,
    },
    homepage: {
      label: "Homepage",
      description: "A URL with more information about the repository.",
      type: "string",
      optional: true,
    },
    private: {
      label: "Private",
      description: "Whether the repository is private.",
      type: "boolean",
      optional: true,
    },
    hasIssues: {
      label: "Has Issues",
      description: "Whether issues are enabled.",
      type: "boolean",
      optional: true,
    },
    hasProjects: {
      label: "Has Projects",
      description: "Whether projects are enabled.",
      type: "boolean",
      optional: true,
    },
    hasWiki: {
      label: "Has Wiki",
      description: "Whether the wiki is enabled.",
      type: "boolean",
      optional: true,
    },
    hasDiscussions: {
      label: "Has Discussions",
      description: "Whether discussions are enabled.",
      type: "boolean",
      optional: true,
    },
    autoInit: {
      label: "Auto Init",
      description: "Whether the repository is initialized with a minimal README.",
      type: "boolean",
      optional: true,
    },
    hasDownloads: {
      label: "Has Downloads",
      description: "Whether downloads are enabled.",
      type: "boolean",
      optional: true,
    },
    isTemplate: {
      label: "Is Template",
      description: "Whether this repository acts as a template that can be used to generate new repositories.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      description: this.description,
      homepage: this.homepage,
      private: this.private,
      has_issues: this.hasIssues,
      has_projects: this.hasProjects,
      has_discussions: this.hasDiscussions,
      has_downloads: this.hasDownloads,
      auto_init: this.autoInit,
      is_template: this.isTemplate,
      team_id: this.teamId,
    };
    const response = await this.github.createRepository({
      data,
    });

    $.export("$summary", `Successfully created repository ${response.full_name}.`);

    return response;
  },
};
