import { toSingleLineString } from "../../common/utils.mjs";
import github from "../../github.app.mjs";

export default {
  key: "github-get-repository-content",
  name: "Get Repository Content",
  description: toSingleLineString(`
    Get the content of a file or directory in a specific repository.
    [See docs here](https://docs.github.com/en/rest/repos/contents#get-repository-content)
  `),
  version: "0.0.8",
  type: "action",
  props: {
    github,
    repoFullname: {
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
      optional: true,
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
