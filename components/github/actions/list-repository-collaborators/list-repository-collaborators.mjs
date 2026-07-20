import github from "../../github.app.mjs";

export default {
  key: "github-list-repository-collaborators",
  name: "List Repository Collaborators",
  description: "List the collaborators on a repository (their login, permissions, and profile links). Use this to see who has access to a repo, or to find a valid collaborator login before assigning issues or requesting reviews. Provide the repository as an `owner/repo` string; if you pass only a repo name, the authenticated user is assumed as the owner. Discover repository names with **List Repositories**. [See the documentation](https://docs.github.com/en/rest/collaborators/collaborators#list-repository-collaborators)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullnameStatic",
      ],
    },
    maxResults: {
      propDefinition: [
        github,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);

    const collaborators = await this.github.getRepositoryCollaborators({
      repoFullname,
      maxResults: this.maxResults,
    });

    $.export("$summary", `Found ${collaborators.length} collaborator(s) in ${repoFullname}`);

    return collaborators;
  },
};
