import github from "../../github.app.mjs";

export default {
  key: "github-create-branch",
  name: "Create Branch",
  description: "Create a new branch in a Gihub repo. [See docs here](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    branchName: {
      label: "Branch Name",
      description: "Name of the new branch",
      type: "string",
    },
    branchSha: {
      label: "Source Branch",
      description: "The source branch",
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.github.createBranch({
      repoFullname: this.repoFullname,
      data: {
        ref: `refs/heads/${this.branchName}`,
        sha: this.branchSha,
      },
    });

    $.export("$summary", `Successfully created branch with ID ${response.object.sha}.`);

    return response;
  },
};
