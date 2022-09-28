import { toSingleLineString } from "../../common/utils.mjs";
import github from "../../github.app.mjs";

export default {
  key: "github-get-repository-content",
  name: "Get Repository Content",
  description: toSingleLineString(`
    Get the content of a file or directory in a specific repository.
    [See docs here](https://docs.github.com/en/rest/repos/contents#get-repository-content)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    github,
    repoFullname: {
      label: "Repository",
      description: "The name of the repository. The name is not case sensitive",
      type: "string",
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    path: {
      label: "Path",
      description: toSingleLineString(`
        The file path or directory to retrieve.
        When left unspecified, this action will retrieve the contents of the
        repository's root directory.
      `),
      type: "string",
      default: "",
    },
  },
  async run({ $ }) {
    const response = await this.github.getRepoContent({
      repoFullname: this.repoFullname,
      path: this.path,
    });

    $.export("$summary", "Successfully retrieved repository content.");

    return response;
  },
};
