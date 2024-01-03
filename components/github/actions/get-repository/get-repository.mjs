import dannyGitHubTest from "../../github.app.mjs";

export default {
  key: "github-get-repository",
  name: "Get Repository",
  description: "Get specific repository. [See docs here](https://docs.github.com/en/rest/repos/repos#get-a-repository)",
  version: "0.0.13",
  type: "action",
  props: {
    dannyGitHubTest,
    repoFullname: {
      propDefinition: [
        dannyGitHubTest,
        "repoFullname",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dannyGitHubTest.getRepo({
      repoFullname: this.repoFullname,
    });

    $.export("$summary", "Successfully retrieved repository.");

    return response;
  },
};
