import github from "../../github.app.mjs";

export default {
  key: "github-get-repository",
  name: "Get Repository Info",
  description: "Get information for a specific repository. [See the documentation](https://docs.github.com/en/rest/repos/repos#get-a-repository)",
  version: "0.0.23",
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
        "repoFullname",
      ],
    },
  },
  async run({ $ }) {
    const { repoFullname } = this;
    const response = await this.github.getRepo({
      repoFullname,
    });

    $.export("$summary", `Successfully retrieved repository ${repoFullname}`);

    return response;
  },
};
