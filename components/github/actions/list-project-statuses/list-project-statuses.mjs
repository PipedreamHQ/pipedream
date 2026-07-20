import github from "../../github.app.mjs";

export default {
  key: "github-list-project-statuses",
  name: "List Project Statuses",
  description: "List the options of a Project (V2) Status field (e.g. `Todo`, `In Progress`, `Done`), returning each option's name and id. Use this to discover the valid status values for a project before calling **Update Project (V2) Item Status**. Get the project number from **List Projects**. Discover organization logins with **List Organizations**. [See the documentation](https://docs.github.com/en/graphql/reference/projects#object-projectv2singleselectfield)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    owner: {
      propDefinition: [
        github,
        "projectOwnerStatic",
      ],
    },
    repo: {
      propDefinition: [
        github,
        "projectRepoStatic",
      ],
    },
    project: {
      propDefinition: [
        github,
        "projectNumberStatic",
      ],
    },
  },
  async run({ $ }) {
    const {
      github, owner: repoOwner, repo: repoName, project,
    } = this;

    // queries the project's ProjectV2SingleSelectField (Status field)
    const field = await github.getProjectV2StatusField({
      repoOwner,
      repoName,
      project,
    });

    const options = field?.options ?? [];

    $.export("$summary", `Found ${options.length} status option(s) for project #${project}`);

    return options;
  },
};
