import { ConfigurationError } from "@pipedream/platform";
import github from "../../github.app.mjs";

export default {
  key: "github-create-branch",
  name: "Create Branch",
  description: "Create a new branch in a Github repo. [See docs here](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference)",
  version: "0.0.12",
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
      description: "The name of the new branch that will be crated",
      type: "string",
    },
    branchSha: {
      label: "Source Branch",
      description: "The source branch that will be used to create the new branch",
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.branchSha) {
      this.branchSha = this.branchSha.split("/")[0];
    } else {
      const branches = await this.github.getBranches({
        repoFullname: this.repoFullname,
      });

      const masterBranch = branches.filter((branch) => branch.name === "master" || branch.name === "main");

      if (masterBranch.length) this.branchSha = masterBranch[0].commit.sha;
    }

    if (!this.branchSha) {
      throw new ConfigurationError("Is required to select one source branch");
    }

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
