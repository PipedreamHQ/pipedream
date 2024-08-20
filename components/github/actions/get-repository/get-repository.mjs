import github from "../../github.app.mjs";

export default {
  key: "github-get-repository",
  name: "Get Repository",
  description: "Get specific repository. [See docs here](https://docs.github.com/en/rest/repos/repos#get-a-repository)",
  version: "0.0.17",
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.github.getRepo({
      repoFullname: this.repoFullname,
    });

    $.export("$summary", "Successfully retrieved repository.");

    return response;
  },
};
